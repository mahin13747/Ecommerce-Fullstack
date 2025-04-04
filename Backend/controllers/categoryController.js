const pool = require("../models/db");

exports.AddCategory = async (req, res) => {
	const { category_name, parent_category } = req.body;

	if (!category_name) {
		return res.status(400).json({ message: "Category name is required" });
	}

	if (parent_category && parent_category === category_name) {
		return res
			.status(400)
			.json({ message: "Category cannot be its own parent" });
	}

	try {
		const checkCategory = await pool.query(
			"SELECT id FROM categories WHERE category_name = $1",
			[category_name]
		);
		if (checkCategory.rows.length > 0) {
			return res.status(409).json({ message: "Category already exists" });
		}

		const result = await pool.query(
			"INSERT INTO categories (category_name, parent_category) VALUES ($1, $2) RETURNING *",
			[category_name, parent_category || null]
		);

		res.status(201).json({
			message: "Category added successfully",
			category: result.rows[0],
		});
	} catch (error) {
		console.error("Error adding category:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

exports.getCategories = async (req, res) => {
	try {
		const result = await pool.query("SELECT * FROM categories");
		res.status(200).json(result.rows);
	} catch (error) {
		console.error("Error fetching categories:", error);
		res.status(500).json({ message: "Internal Server Error" });
	}
};

exports.getCategoryById = async (req, res) => {
	const { id } = req.params;

	try {
		const result = await pool.query(
			"SELECT * FROM categories WHERE id = $1 AND deleted_at IS NULL",
			[id]
		);

		if (result.rows.length === 0) {
			return res.status(404).json({ message: "Category not found" });
		}

		res.status(200).json(result.rows[0]);
	} catch (error) {
		console.error("Error fetching category:", error);
		res.status(500).json({ message: "Internal Server Error" });
	}
};

exports.updateCategory = async (req, res) => {
	const { id } = req.params;
	const { category_name, parent_category } = req.body;

	// Validate input
	if (!category_name) {
		return res.status(400).json({ message: "Category name is required" });
	}

	if (parent_category && parent_category === id) {
		return res
			.status(400)
			.json({ message: "Category cannot be its own parent" });
	}

	try {
		const checkCategory = await pool.query(
			"SELECT id FROM categories WHERE category_name = $1 AND id != $2",
			[category_name, id]
		);
		if (checkCategory.rows.length > 0) {
			return res.status(409).json({ message: "Category name already exists" });
		}

		const result = await pool.query(
			"UPDATE categories SET category_name = $1, parent_category = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *",
			[category_name, parent_category, id]
		);

		if (result.rows.length === 0) {
			return res.status(404).json({ message: "Category not found" });
		}

		res.status(200).json({
			message: "Category updated successfully",
			category: result.rows[0],
		});
	} catch (error) {
		console.error("Error updating category:", error);
		res.status(500).json({ message: "Internal Server Error" });
	}
};
exports.deleteCategory = async (req, res) => {
	const { id } = req.params;

	try {
		const result = await pool.query(
			"DELETE FROM categories WHERE id = $1 RETURNING *",
			[id]
		);

		if (result.rows.length === 0) {
			return res.status(404).json({ message: "Category not found" });
		}

		res.status(200).json({ message: "Category deleted successfully" });
	} catch (error) {
		console.error("Error deleting category:", error);
		res.status(500).json({ message: "Internal Server Error" });
	}
};
