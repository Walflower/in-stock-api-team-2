const router = require("express").Router();
const inventoriesController = require("../controllers/inventories-controllers");

router.route("/").get(inventoriesController.getInventories);

module.exports = router;
