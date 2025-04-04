const pool = require("../models/db");

exports.checkout = async (req, res) => {
	try {
		const { user_id } = req.body;

		const cartQuery = await pool.query(
			"SELECT product_id, quantity FROM cart WHERE user_id = $1",
			[user_id]
		);
		const cartItems = cartQuery.rows;

		if (cartItems.length === 0) {
			return res.status(400).json({ error: "Cart is empty" });
		}

		const productIds = cartItems.map((item) => item.product_id);
		const productQuery = await pool.query(
			"SELECT id, price FROM products WHERE id = ANY($1)",
			[productIds]
		);
		const productDetails = productQuery.rows;

		let totalAmount = 0;
		const formattedProducts = cartItems.map((item) => {
			const product = productDetails.find((p) => p.id === item.product_id);
			if (product) {
				totalAmount += product.price * item.quantity;
				return {
					product_id: item.product_id,
					quantity: item.quantity,
					price: product.price,
				};
			}
		});

		const newOrder = await pool.query(
			"INSERT INTO orders (user_id, products, total_amount, status) VALUES ($1, $2::jsonb, $3, 'Pending') RETURNING *",
			[user_id, JSON.stringify(formattedProducts), totalAmount]
		);

		await pool.query("DELETE FROM cart WHERE user_id = $1", [user_id]);

		res
			.status(201)
			.json({ message: "Checkout successful", order: newOrder.rows[0] });
	} catch (error) {
		console.error("Checkout Error:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};
