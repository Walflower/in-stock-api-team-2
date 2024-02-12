require("dotenv").config({ path: "../.env" });
const express = require("express");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 8000;
const BASE_PATH = process.env.BASE_PATH;
const knex = require("knex");
const knexConfig = require("../knexfile");

const dbAccess = knex(knexConfig);

app.use(express.json());
app.use(cors());

app.get(BASE_PATH, (req, res, next) => {
	res.send("IT WORKS WOW");
	console.log(req.url);
	console.log("time", Date.now());
	next();
});

// app.get(`${BASE_PATH}warehouses`, (req, res, next) => {
// 	dbAccess("warehouses")
// 		.select("*")
// 		.then((warehouses) => {
// 			res.send(warehouses);
// 			next();
// 		})
// 		.catch((err) => {
// 			console.log(err);
// 			next();
// 		});
// });
// 
// app.get(`${BASE_PATH}inventories`, (req, res, next) => {
// 	dbAccess("inventories")
// 		.select("*")
// 		.then((inventories) => {
// 			res.send(inventories);
// 			next();
// 		})
// 		.catch((err) => {
// 			console.log(err);
// 			next();
// 		});
// });

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
