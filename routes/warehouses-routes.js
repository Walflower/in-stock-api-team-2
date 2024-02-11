const router = require("express").Router();
const warehousesController = require("../controllers/warehouses-controller");

router
  .route("/")
  .get(warehousesController.getWarehouses)
  .post(warehousesController.add);

router
  .route("/:id")
  .get(warehousesController.findOne)
  .delete(warehousesController.remove);

router
  .route("/:id")
  .get(warehousesController.findOne)
  .put(warehousesController.edit);

router.route("/:id/inventories").get(warehousesController.warehouseInventory);

module.exports = router;
