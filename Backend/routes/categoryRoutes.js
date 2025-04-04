const express = require("express");
const {
	deleteCategory,
	updateCategory,
	getCategoryById,
	getCategories,
	AddCategory,
} = require("../controllers/categoryController");
const { authenticateToken, authorizeRole } = require("../middlewares/auth");

const router = express.Router();

router.post(
	"/categories",
	authenticateToken,
	authorizeRole("admin"),
	AddCategory
);
router.get("/categories", getCategories);
router.get("/categories/:id", authenticateToken, getCategoryById);
router.put(
	"/categories/:id",
	authenticateToken,
	authorizeRole("admin"),
	updateCategory
);
router.delete(
	"/categories/:id",
	authenticateToken,
	authorizeRole("admin"),
	deleteCategory
);

module.exports = router;
