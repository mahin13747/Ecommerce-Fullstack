import pool from "../models/db.js";

export const createOrder = async (req, res) => {
	try {
		const { user_id, products, total_amount, status, payment_status } =
			req.body;

		const productIds = products.map((p) => p.product_id);

		const productCheckQuery = await pool.query(
			"SELECT id FROM products WHERE id = ANY($1)",
			[productIds]
		);

		const existingProductIds = productCheckQuery.rows.map((row) => row.id);
		const missingProducts = productIds.filter(
			(id) => !existingProductIds.includes(id)
		);

		if (missingProducts.length > 0) {
			return res.status(400).json({
				error: "Some products do not exist",
				missing_products: missingProducts,
			});
		}

		const formattedProducts = JSON.stringify(products);

		const newOrder = await pool.query(
			"INSERT INTO orders (user_id, products, total_amount, status, payment_status) VALUES ($1, $2::jsonb, $3, $4, $5) RETURNING *",
			[user_id, formattedProducts, total_amount, status, payment_status]
		);

		res.status(201).json({
			message: "Order created successfully",
			order: newOrder.rows[0],
		});
	} catch (error) {
		console.error("Error creating order:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const getOrders = async (req, res) => {
	try {
		const query = `
			SELECT 
				o.id AS order_id, 
				o.user_id, 
				u.name AS customer_name, 
				u.email AS customer_email, 
				o.products, 
				o.total_amount, 
				o.status, 
				o.payment_status, 
				o.created_at, 
				o.updated_at
			FROM orders o
			LEFT JOIN users u ON o.user_id = u.id
			ORDER BY o.created_at DESC;
		`;

		const result = await pool.query(query);
		res.json(result.rows);
	} catch (error) {
		console.error("Error fetching orders:", error);
		res.status(500).json({ message: "Internal Server Error" });
	}
};

export const getOrderByUserId = async (req, res) => {
	const { id } = req.params;

	try {
		const result = await pool.query("SELECT * FROM orders WHERE user_id = $1", [
			id,
		]);

		if (result.rows.length === 0) {
			return res.status(404).json({ message: "Orders not found" });
		}

		res.json(result.rows);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal Server Error" });
	}
};

export const updateOrder = async (req, res) => {
	const { id } = req.params;
	const { status, payment_status } = req.body;

	try {
		const result = await pool.query(
			"UPDATE orders SET status = $1, payment_status = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *",
			[status, payment_status, id]
		);

		if (result.rows.length === 0) {
			return res.status(404).json({ message: "Order not found" });
		}

		res.json({ message: "Order updated successfully", order: result.rows[0] });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal Server Error" });
	}
};

export const updateOrderStatus = async (req, res) => {
	const { id } = req.params;
	const { status } = req.body;

	const validStatuses = ["Pending", "Shipped", "Delivered"];
	if (!validStatuses.includes(status)) {
		return res.status(400).json({ error: "Invalid order status" });
	}

	try {
		const result = await pool.query(
			"UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *",
			[status, id]
		);

		if (result.rows.length === 0) {
			return res.status(404).json({ message: "Order not found" });
		}

		res.json({ message: "Order status updated", order: result.rows[0] });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal Server Error" });
	}
};

export const deleteOrder = async (req, res) => {
	const orderId = parseInt(req.params.id, 10);

	if (isNaN(orderId)) {
		return res.status(400).json({ error: "Invalid order ID" });
	}

	try {
		await pool.query("DELETE FROM orders WHERE id = $1", [orderId]);
		res.status(200).json({ message: "Order deleted successfully" });
	} catch (error) {
		console.error("Error deleting order:", error);
		res.status(500).json({ error: "Server error" });
	}
};
