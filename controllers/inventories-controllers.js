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


module.exports = {
  getInventories,
};
