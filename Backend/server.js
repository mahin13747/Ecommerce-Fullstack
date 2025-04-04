const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/users");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/ProductsRoutes");
const orderRoutes = require("./routes/orderRoutes");
const cartRoutes = require("./routes/cartRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
// const categoryRoutes = require("./routes/categories");
const pool = require("./models/db");
const checkoutRoutes = require("./routes/checkoutRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// app.use((req, res, next) => {
// 	console.log(`${req.method} ${req.url} - Headers:`, req.headers);
// 	next();
// });

app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", orderRoutes);
app.use("/api", productRoutes);
app.use("/api", cartRoutes);
app.use("/api", wishlistRoutes);
app.use("/api/checkout", checkoutRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
