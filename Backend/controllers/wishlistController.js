const pool = require("../models/db");
exports.addToWishlist = async (req, res) => {
	try {
		const { user_id, product_id } = req.body;

		const query = `
      INSERT INTO wishlist (user_id, product_id)
      VALUES ($1, $2)
      ON CONFLICT (user_id, product_id) DO NOTHING
      RETURNING *;
    `;

		const result = await pool.query(query, [user_id, product_id]);

		if (result.rows.length === 0) {
			return res.status(409).json({ message: "Product already in wishlist" });
		}

		res.status(201).json(result.rows[0]);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

exports.getWishlist = async (req, res) => {
	try {
		const { userId } = req.params;

		const query = `
			SELECT p.* FROM wishlist w
			JOIN products p ON w.product_id = p.id
			WHERE w.user_id = $1;
		`;

		const { rows } = await pool.query(query, [userId]);

		res.json(rows);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

exports.removeFromWishlist = async (req, res) => {
	try {
		const { user_id, product_id } = req.params;
		await pool.query(
			`DELETE FROM wishlist WHERE user_id = $1 AND product_id = $2`,
			[user_id, product_id]
		);
		res.json({ message: "Product removed from wishlist" });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};
