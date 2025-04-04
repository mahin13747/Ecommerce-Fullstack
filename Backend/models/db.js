const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
	user: process.env.DB_USER,
	host: process.env.DB_HOST,
	database: process.env.DB_NAME,
	password: process.env.DB_PASSWORD,
	port: process.env.DB_PORT,
	ssl: {
		rejectUnauthorized: false, // Required for Render
	},
});

pool
	.connect()
	.then(() => {
		console.log("✅ Connected to the database successfully!");
	})
	.catch((error) => {
		console.error("Database connection error:", error);
		process.exit(1);
	});

module.exports = pool;
