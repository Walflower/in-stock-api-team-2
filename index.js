const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const PORT = process.env.PORT || 8000;
const { BASE_PATH } = process.env;

app.use(express.json());
app.use(cors());

app.use("/", (req, res, next) => {
  console.log(req.url);
  console.log("time", Date.now());
  next();
});

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
