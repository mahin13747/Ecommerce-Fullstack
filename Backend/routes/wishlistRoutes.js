const express = require("express");
const {
	addToWishlist,
	getWishlist,
	removeFromWishlist,
} = require("../controllers/wishlistController");

const router = express.Router();

// Wishlist Routes
router.post("/wishlist", addToWishlist);
router.get("/wishlist/:userId", getWishlist);
router.delete("/wishlist/:user_id/:product_id", removeFromWishlist);

module.exports = router;
