const express = require("express");
const {
	AddProduct,
	getProducts,
	getProductById,
	updateProduct,
	deleteProduct,
	AddMultipleProducts,
	searchProducts,
	filterByCategory,
	filterByPrice,
	filterByRating,
	getPaginatedProducts,
	getFilteredProducts,
} = require("../controllers/ProductController");

const { authenticateToken, authorizeRole } = require("../middlewares/auth");
const router = express.Router();

router.get("/products/search", searchProducts);
router.get("/products/category", filterByCategory);
router.get("/products/price", filterByPrice);
router.get("/products/rating", filterByRating);
router.get("/products/paginate", getPaginatedProducts);
router.get("/products/filter", getFilteredProducts);

router.post("/products", authenticateToken, authorizeRole("admin"), AddProduct);
router.post(
	"/products/bulk",
	authenticateToken,
	authorizeRole("admin"),
	AddMultipleProducts
);

router.get("/products", getProducts);
router.get("/products/:id", getProductById);
router.put(
	"/products/:id",
	authenticateToken,
	authorizeRole("admin"),
	updateProduct
);
router.delete(
	"/products/:id",
	authenticateToken,
	authorizeRole("admin"),
	deleteProduct
);

module.exports = router;
