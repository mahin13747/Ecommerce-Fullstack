const express = require("express");
const {
	createOrder,
	getOrders,
	updateOrder,
	deleteOrder,
	updateOrderStatus,
	getOrderByUserId,
} = require("../controllers/orderController");
const { authenticateToken, authorizeRole } = require("../middlewares/auth");

const router = express.Router();

router.post("/orders", authenticateToken, createOrder);
router.get("/orders", authenticateToken, authorizeRole("admin"), getOrders);
router.get("/orders/:id", authenticateToken, getOrderByUserId);
router.put(
	"/orders/:id",
	authenticateToken,
	authorizeRole("admin"),
	updateOrder
);
router.patch("/orders/:id/status", authenticateToken, updateOrderStatus);
router.delete("/orders/:id", authenticateToken, deleteOrder);

module.exports = router;
