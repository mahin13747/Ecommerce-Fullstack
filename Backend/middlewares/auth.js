const jwt = require("jsonwebtoken");
require("dotenv").config();
// Middleware for JWT Authentication
const authenticateToken = (req, res, next) => {
	const authToken = req.headers["authorization"];
	const token = authToken && authToken.split(" ")[1];

	if (!token) {
		return res.status(401).json({ message: "Unauthorized: No token provided" });
	}

	jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
		if (err) {
			return res.status(403).json({ message: "Forbidden: Invalid token" });
		}
		req.user = user;
		next();
	});
};

// Middleware for Role-Based Authorization
const authorizeRole = (role) => {
	return (req, res, next) => {
		if (req.user.role !== role) {
			return res
				.status(403)
				.json({ message: "Access denied: Insufficient permissions" });
		}
		next();
	};
};

module.exports = { authenticateToken, authorizeRole };
