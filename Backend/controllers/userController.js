const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../models/db");
exports.RegisterUser = async (req, res) => {
	const { name, email, password, role, address, phone_number, adminToken } =
		req.body;

	if (!name || !email || !password || !address || !phone_number) {
		return res.status(400).json({ message: "Missing required fields" });
	}

	try {
		if (role === "admin") {
			if (!adminToken) {
				return res.status(403).json({ message: "Admin token required" });
			}

			const decoded = jwt.verify(adminToken, process.env.JWT_SECRET);
			const adminUser = await pool.query(
				"SELECT role FROM users WHERE id = $1",
				[decoded.userId]
			);

			if (adminUser.rows[0]?.role !== "admin") {
				return res
					.status(403)
					.json({ message: "Only admins can create new admins" });
			}
		}

		const hashedPassword = await bcrypt.hash(password, 10);
		const result = await pool.query(
			"INSERT INTO users (name, email, password, role, address, phone_number) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id",
			[
				name,
				email.toLowerCase(),
				hashedPassword,
				role || "user",
				address,
				phone_number,
			]
		);

		res.status(201).json({ message: "User registered successfully" });
	} catch (error) {
		if (error.code === "23505") {
			return res.status(409).json({ message: "User already exists" });
		}
		console.error(error);
		res.status(500).json({ message: "Internal Server Error" });
	}
};

exports.LoginUser = async (req, res) => {
	const { email, password } = req.body;

	if (!email || !password) {
		return res.status(400).json({ message: "Missing fields" });
	}

	try {
		const result = await pool.query("SELECT * FROM users WHERE email = $1", [
			email.toLowerCase(),
		]);

		if (result.rows.length === 0) {
			return res.status(401).json({ message: "Invalid credentials" });
		}

		const user = result.rows[0];
		const passwordMatch = await bcrypt.compare(password, user.password);

		if (!passwordMatch) {
			return res.status(401).json({ message: "Invalid credentials" });
		}

		const token = jwt.sign(
			{ userId: user.id, role: user.role },
			process.env.JWT_SECRET,
			{ expiresIn: "8h" }
		);

		res.json({
			token,
			user: {
				id: user.id,
				name: user.name,
				email: user.email,
				role: user.role,
			},
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal server error" });
	}
};

exports.getUsers = async (req, res) => {
	try {
		const result = await pool.query(
			"SELECT id, name, email, role, address, phone_number,created_at FROM users"
		);
		res.json(result.rows);
	} catch (error) {
		console.error("Error fetching users:", error);
		res.status(500).json({ message: "Internal Server Error" });
	}
};

exports.getOneUser = async (req, res) => {
	try {
		const { id } = req.params;

		const result = await pool.query(
			"SELECT id, name, email, role, address, phone_number FROM users WHERE id = $1",
			[id]
		);

		if (result.rows.length === 0) {
			return res.status(404).json({ message: "User not found" });
		}

		res.json(result.rows[0]);
	} catch (error) {
		console.error("Error fetching user:", error);
		res.status(500).json({ message: "Internal Server Error" });
	}
};
exports.DeleteUser = async (req, res) => {
	const { id } = req.params;

	try {
		const result = await pool.query("DELETE FROM users WHERE id = $1", [id]);

		if (result.rowCount === 0) {
			return res.status(404).json({ message: "User  not found" });
		}

		res.json({ message: "User  deleted successfully" });
	} catch (error) {
		console.error("Error deleting user:", error);
		res.status(500).json({ message: "Internal Server Error" });
	}
};

exports.UpdateUser = async (req, res) => {
	const { id } = req.params;
	const { name, email, role, address, phone_number, password } = req.body;

	try {
		const userCheck = await pool.query("SELECT * FROM users WHERE id = $1", [
			id,
		]);

		if (userCheck.rows.length === 0) {
			return res.status(404).json({ message: "User not found" });
		}

		if (role && role !== userCheck.rows[0].role) {
			const token = req.headers.authorization.split(" ")[1];
			const decoded = jwt.verify(token, process.env.JWT_SECRET);
			const requesterRole = decoded.role;

			if (requesterRole !== "admin") {
				return res
					.status(403)
					.json({ message: "Only admins can change user roles" });
			}
		}

		let hashedPassword;
		if (password) {
			hashedPassword = await bcrypt.hash(password, 10);
		}

		const updateQuery = `
      UPDATE users SET
        name = COALESCE($1, name),
        email = COALESCE($2, email),
        role = COALESCE($3, role),
        address = COALESCE($4, address),
        phone_number = COALESCE($5, phone_number),
        password = COALESCE($6, password),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $7
      RETURNING id, name, email, role, address, phone_number
    `;

		const queryParams = [
			name,
			email ? email.toLowerCase() : null,
			role,
			address,
			phone_number,
			hashedPassword,
			id,
		];

		const result = await pool.query(updateQuery, queryParams);

		res.json({
			message: "User updated successfully",
			user: result.rows[0],
		});
	} catch (error) {
		console.error("Error updating user:", error);

		if (error.code === "23505") {
			return res
				.status(409)
				.json({ message: "Email already in use by another user" });
		}

		if (error.name === "JsonWebTokenError") {
			return res.status(401).json({ message: "Invalid authentication token" });
		}

		res.status(500).json({ message: "Internal Server Error" });
	}
};
