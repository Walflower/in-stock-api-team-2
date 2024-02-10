const router = require("express").Router();
const inventoriesController = require("../controllers/inventories-controllers");

router
    .route("/")
    .get(inventoriesController.getInventories);

router
    .route("/:id")
    .get(inventoriesController.getOne)

module.exports = router;
