const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const PORT = process.env.PORT || 8000;
// const { BASE_PATH } = process.env;
const warehouses = require("./routes/warehouses-routes");
const inventories = require("./routes/inventories-routes");

//middlware
app.use(express.json());
app.use(cors());

//Here just so we can see when the client is hitting the api. Can remove later, TODO!
app.use("/", (req, res, next) => {
  console.log(req.url);
  console.log("time", Date.now());
  next();
});

app.use("/warehouses", warehouses);
app.use("/inventories", inventories);


app.listen(PORT, () => console.log(`Listening on ${PORT}`));
