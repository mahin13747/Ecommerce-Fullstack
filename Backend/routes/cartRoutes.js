const express = require("express");
const {
	addToCart,
	getCart,
	updateCart,
	removeFromCart,
} = require("../controllers/cartController");

const router = express.Router();

// Cart Routes
router.post("/cart", addToCart);
router.get("/cart/:userId", getCart);
router.put("/cart", updateCart);
router.delete("/cart", removeFromCart);

module.exports = router;
