require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const PORT = process.env.DB_PORT || 8000;
const BASE_PATH = process.env.BASE_PATH;
const knexConfig = require("../knexfile");
const knex = require("knex")(knexConfig);

app.use(express.json());
app.use(cors());

app.get("/", (req, res, next) => {
	res.send("Hello World");
	console.log(req.url);
	console.log("time", Date.now());
	next();
});

app.get("/warehouses", async (req, res) => {
	try {
		const warehouses = await knex("warehouses").select("*");
		res.status(200).json(warehouses);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal server error" });
	}
});

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
