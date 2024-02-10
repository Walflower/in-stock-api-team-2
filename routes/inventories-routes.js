const router = require("express").Router();
const inventoriesController = require("../controllers/inventories-controllers");

router
  .route("/")
  .get(inventoriesController.getInventories)
  .post(inventoriesController.createInventoryItem);
    

router
    .route("/:id")
    .get(inventoriesController.getOne)

module.exports = router;
