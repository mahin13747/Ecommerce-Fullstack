const pool = require("../models/db");

exports.AddProduct = async (req, res) => {
	const { title, description, price, category_id, stock, images, rating } =
		req.body;

	if (!title || !price || !category_id || !stock || !images) {
		return res.status(400).json({ message: "Missing required fields" });
	}

	if (rating && (rating < 0 || rating > 5)) {
		return res.status(400).json({ message: "Rating must be between 0 and 5" });
	}

	if (typeof stock !== "number" || stock < 0) {
		return res.status(400).json({ message: "Stock must be a positive number" });
	}

	try {
		const imagesArray =
			typeof images === "string" ? JSON.parse(images) : images;

		const result = await pool.query(
			`INSERT INTO products (title, description, price, category_id, stock, images, rating) 
             VALUES ($1, $2, $3, $4, $5, $6::jsonb, $7) RETURNING *`,
			[
				title,
				description,
				price,
				category_id,
				stock,
				JSON.stringify(imagesArray),
				rating,
			]
		);

		res
			.status(201)
			.json({ message: "Product added successfully", product: result.rows[0] });
	} catch (error) {
		console.error("Error adding product:", error);
		res.status(500).json({ message: "Internal Server Error" });
	}
};

exports.getProducts = async (req, res) => {
	try {
		const result = await pool.query(`
			SELECT 
				products.id,
				products.title,
				products.description,
				products.price,
				products.stock,
				products.images,
				products.rating,
				products.created_at,
				products.updated_at,
				products.category_id,  
				categories.category_name
			FROM products
			LEFT JOIN categories ON products.category_id = categories.id
			ORDER BY products.id ASC
		`);
		res.json(result.rows);
	} catch (error) {
		console.error("Error fetching products:", error);
		res.status(500).json({ message: "Internal Server Error" });
	}
};

exports.getProductById = async (req, res) => {
	try {
		const productId = parseInt(req.params.id, 10);

		if (isNaN(productId)) {
			return res.status(400).json({ error: "Invalid product ID" });
		}

		const result = await pool.query("SELECT * FROM products WHERE id = $1", [
			productId,
		]);

		if (result.rows.length === 0) {
			return res.status(404).json({ error: "Product not found" });
		}

		res.json(result.rows[0]);
	} catch (error) {
		console.error("Error fetching product:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};
exports.updateProduct = async (req, res) => {
	try {
		const { id } = req.params;
		let { title, description, price, category_id, stock, images, rating } =
			req.body;

		if (typeof images === "string") {
			images = JSON.parse(images);
		}

		const query = `
			UPDATE products 
			SET title = $1, description = $2, price = $3, category_id = $4, stock = $5, images = $6, rating = $7
			WHERE id = $8 RETURNING *;
		`;
		const values = [
			title,
			description,
			price,
			category_id,
			stock,
			JSON.stringify(images),
			rating,
			id,
		];

		const result = await pool.query(query, values);
		res.json(result.rows[0]);
	} catch (error) {
		console.error("Error updating product:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

exports.deleteProduct = async (req, res) => {
	const { id } = req.params;

	try {
		const result = await pool.query(
			"DELETE FROM products WHERE id = $1 RETURNING *",
			[id]
		);

		if (result.rows.length === 0) {
			return res.status(404).json({ message: "Product not found" });
		}

		res.json({ message: "Product deleted successfully" });
	} catch (error) {
		console.error("Error deleting product:", error);
		res.status(500).json({ message: "Internal Server Error" });
	}
};
exports.AddMultipleProducts = async (req, res) => {
	const { products } = req.body;

	if (!products || !Array.isArray(products) || products.length === 0) {
		return res.status(400).json({ message: "Invalid product data" });
	}

	const values = products.map((p) => [
		p.title,
		p.description,
		p.price,
		p.category_id,
		p.stock,
		JSON.stringify(p.images),
		p.rating,
	]);

	try {
		const query = `
            INSERT INTO products (title, description, price, category_id, stock, images, rating)
            VALUES ${values
							.map(
								(_, i) =>
									`($${i * 7 + 1}, $${i * 7 + 2}, $${i * 7 + 3}, $${
										i * 7 + 4
									}, $${i * 7 + 5}, $${i * 7 + 6}, $${i * 7 + 7})`
							)
							.join(", ")}
            RETURNING *;
        `;

		const flatValues = values.flat();
		const result = await pool.query(query, flatValues);
		res
			.status(201)
			.json({ message: "Products added successfully", products: result.rows });
	} catch (error) {
		console.error("Error adding products:", error);
		res.status(500).json({ message: "Internal Server Error" });
	}
};

exports.searchProducts = async (req, res) => {
	try {
		console.log("Route hit!"); // Check if the function is even being called
		const { search } = req.query;
		console.log("Search query:", search); // Check if search param is received

		if (!search) {
			return res.status(400).json({ error: "Search query is required" });
		}

		const result = await pool.query(
			"SELECT * FROM products WHERE title ILIKE $1 OR description ILIKE $1",
			[`%${search}%`]
		);

		if (result.rows.length === 0) {
			return res.status(404).json({ message: "No products found" });
		}

		res.json(result.rows);
	} catch (error) {
		console.error("Error searching products:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

exports.filterByCategory = async (req, res) => {
	try {
		console.log("Query Params:", req.query); // Debug log
		const { category_id } = req.query;

		if (!category_id) {
			return res.status(400).json({ error: "Category ID is required" });
		}

		const result = await pool.query(
			"SELECT * FROM products WHERE category_id = $1",
			[category_id]
		);

		if (result.rows.length === 0) {
			return res
				.status(404)
				.json({ message: "No products found for this category" });
		}

		res.json(result.rows);
	} catch (error) {
		console.error("Error filtering products by category:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

exports.filterByPrice = async (req, res) => {
	try {
		const { min_price, max_price } = req.query;

		if (!min_price || !max_price) {
			return res.status(400).json({ error: "Min and max price are required" });
		}

		const result = await pool.query(
			"SELECT * FROM products WHERE price BETWEEN $1 AND $2",
			[min_price, max_price]
		);

		res.json(result.rows);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

exports.filterByRating = async (req, res) => {
	try {
		console.log("Query Params:", req.query); // Debug log
		const { min_rating } = req.query;

		if (!min_rating) {
			return res.status(400).json({ error: "Rating is required" });
		}

		const result = await pool.query(
			"SELECT * FROM products WHERE rating >= $1",
			[min_rating]
		);

		if (result.rows.length === 0) {
			return res
				.status(404)
				.json({ message: "No products found with this rating" });
		}

		res.json(result.rows);
	} catch (error) {
		console.error("Error filtering products by rating:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

exports.getPaginatedProducts = async (req, res) => {
	try {
		let { page, limit } = req.query;

		page = page ? parseInt(page) : 1;
		limit = limit ? parseInt(limit) : 10;
		const offset = (page - 1) * limit;

		const result = await pool.query(
			"SELECT * FROM products LIMIT $1 OFFSET $2",
			[limit, offset]
		);

		res.json(result.rows);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

exports.getFilteredProducts = async (req, res) => {
	try {
		let { search, category, min_price, max_price, rating, page, limit } =
			req.query;

		page = page ? parseInt(page) : 1;
		limit = limit ? parseInt(limit) : 10;
		const offset = (page - 1) * limit;

		let query = "SELECT * FROM products WHERE 1=1";
		let values = [];
		let counter = 1;

		if (search) {
			query += ` AND (title ILIKE $${counter} OR description ILIKE $${counter})`;
			values.push(`%${search}%`);
			counter++;
		}
		if (category) {
			query += ` AND category_id = $${counter}`;
			values.push(category);
			counter++;
		}
		if (min_price && max_price) {
			query += ` AND price BETWEEN $${counter} AND $${counter + 1}`;
			values.push(min_price, max_price);
			counter += 2;
		}
		if (rating) {
			query += ` AND rating >= $${counter}`;
			values.push(rating);
			counter++;
		}

		query += ` LIMIT $${counter} OFFSET $${counter + 1}`;
		values.push(limit, offset);

		const result = await pool.query(query, values);
		res.json(result.rows);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};
