const pool = require("../models/db");

exports.addToCart = async (req, res) => {
	try {
		const { user_id, product_id, quantity } = req.body;

		const checkQuery = `SELECT * FROM cart WHERE user_id = $1 AND product_id = $2`;
		const checkResult = await pool.query(checkQuery, [user_id, product_id]);

		if (checkResult.rows.length > 0) {
			const updateQuery = `
                UPDATE cart 
                SET quantity = quantity + $3 
                WHERE user_id = $1 AND product_id = $2 
                RETURNING *;
            `;
			const updatedCart = await pool.query(updateQuery, [
				user_id,
				product_id,
				quantity,
			]);
			return res.json(updatedCart.rows[0]);
		} else {
			const insertQuery = `
                INSERT INTO cart (user_id, product_id, quantity) 
                VALUES ($1, $2, $3) 
                RETURNING *;
            `;
			const newCart = await pool.query(insertQuery, [
				user_id,
				product_id,
				quantity,
			]);
			return res.status(201).json(newCart.rows[0]);
		}
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

exports.getCart = async (req, res) => {
	try {
		const { userId } = req.params;
		const query = `
            SELECT 
                cart.id AS cart_id, 
                cart.user_id, 
                cart.product_id, 
                cart.quantity, 
                products.title, 
                products.price, 
                (products.images->>0) AS image 
            FROM cart
            JOIN products ON cart.product_id = products.id
            WHERE cart.user_id = $1;
        `;

		const cartItems = await pool.query(query, [userId]);
		res.json(cartItems.rows);
	} catch (error) {
		console.error("Error fetching cart:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

exports.updateCart = async (req, res) => {
	try {
		const { user_id, product_id, quantity } = req.body;
		const { rows } = await pool.query(
			`UPDATE cart 
            SET quantity = $3 
            WHERE user_id = $1 AND product_id = $2 
            RETURNING *`,
			[user_id, product_id, quantity]
		);
		res.json(rows[0]);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

exports.removeFromCart = async (req, res) => {
	try {
		const { user_id, product_id } = req.body;
		await pool.query(
			`DELETE FROM cart WHERE user_id = $1 AND product_id = $2`,
			[user_id, product_id]
		);
		res.json({ message: "Product removed from cart" });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};
