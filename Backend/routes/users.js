const express = require("express");
const {
	RegisterUser,
	LoginUser,
	getUsers,
	getOneUser,
	DeleteUser,
	UpdateUser,
} = require("../controllers/userController");
const { authenticateToken, authorizeRole } = require("../middlewares/auth");
const router = express.Router();

router.post("/register", RegisterUser);
router.post("/login", LoginUser);
router.get("/users", authenticateToken, authorizeRole("admin"), getUsers);
router.get("/user/:id", authenticateToken, getOneUser);
router.delete(
	"/user/:id",
	authenticateToken,
	authorizeRole("admin"),
	DeleteUser
);
router.put("/user/:id", authenticateToken, authorizeRole("admin"), UpdateUser);

module.exports = router;
