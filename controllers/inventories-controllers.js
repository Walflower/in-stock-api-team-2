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

//post/create new inventory item

const createInventoryItem = async (req, res) => {
  const { warehouse_id, item_name, description, category, status, quantity } =
    req.body;

  if (
    !warehouse_id ||
    !item_name ||
    !description ||
    !category ||
    !status ||
    !quantity
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const warehouseExists = await knex("warehouses")
      .where({
        id: warehouse_id,
      })
      .first();

    if (!warehouseExists) {
      return res
        .status(400)
        .json({ message: "Warehouse with the provided ID does not exist" });
    }

    if (isNaN(req.body.quantity)) {
      return res.status(400).json({ message: "Quantity must be a number" });
    }

    const newInventoryItem = {
      warehouse_id,
      item_name,
      description,
      category,
      status,
      quantity: parseInt(quantity),
    };

    // Insert new inventory item into the database
    const [newInventoryItemId] = await knex("inventories").insert(
      newInventoryItem
    );

    // Fetch the inserted inventory item
    const newInventoryItemCreated = await knex("inventories")
      .where("id", newInventoryItemId)
      .first();

    res.status(201).json(newInventoryItemCreated);
  } catch (error) {
    res.status(500).json({
      message: `Unable to create new inventory item: ${error}`,
    });
  }
};

module.exports = {
  getInventories,
  createInventoryItem,
};
