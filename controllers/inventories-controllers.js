// const knex = require("knex")(require("../knexfile"));

// const getInventories = async (_req, res) => {
//   try {
//     const data = await knex("inventories");
//     res.status(200).json(data);
//   } catch (err) {
//     res.status(400).send(`Error retrieving inventories: ${err}`);
//   }
// };

// module.exports = {
//   getInventories,
// };

 
const knex = require("knex")(require("../knexfile"));

const getInventories = async (_req, res) => {
  try {
    const data = await knex("inventories")
      .select(
        "inventories.id",
        "inventories.item_name",
        "inventories.description",
        "inventories.category",
        "inventories.status",
        "inventories.quantity",
        "inventories.warehouse_id",
        "warehouses.warehouse_name"
      )
      .innerJoin("warehouses", "inventories.warehouse_id", "warehouses.id");
    res.status(200).json(data);
  } catch (err) {
    res.status(400).send(`Error retrieving inventories: ${err}`);
  }
};

//to get a single inventory item
const getOne = async (req, res) => {
  try {
    const inventoryItemFound = await knex("inventories").where({
      id: req.params.id,
    });

    if (inventoryItemFound.length === 0) {
      return res.status(404).json({
        message: `Warehouse with ID ${req.params.id} not found`,
      });
    }

    const inventoryData = inventoryItemFound[0];
    res.json(inventoryData);
  } catch (error) {
    res.status(500).json({
      message: `Unable to retrieve inventory item with ID ${req.params.id}`,
    });
  }
};

module.exports = {
  getInventories,
  getOne
};
