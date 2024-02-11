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
      .innerJoin("warehouses", "inventories.warehouse_id", "warehouses.id")
      .orderBy("id");
    res.status(200).json(data);
  } catch (err) {
    res.status(400).send(`Error retrieving inventories: ${err}`);
  }
};

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

    if (typeof req.body.quantity !== "number") {
      return res.status(400).json({ message: "Quantity must be a number" });
    }

    const newInventoryItem = {
      warehouse_id,
      item_name,
      description,
      category,
      status,
      quantity,
    };

    const [newInventoryItemId] = await knex("inventories").insert(
      newInventoryItem
    );

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

const update = async (req, res) => {
  try {
    const inventoryId = req.params.id;
    const requestedInventory = await knex("inventories")
      .where({ id: inventoryId })
      .first();
    if (!requestedInventory) {
      return res
        .status(404)
        .json({ message: `inventory with ID ${req.params.id} not found` });
    }

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

    const requestedWarehouse = await knex("warehouses")
      .where({
        id: warehouse_id,
      })
      .first();

    if (!requestedWarehouse) {
      return res
        .status(400)
        .json({ message: "Warehouse with the provided ID does not exist" });
    }

    if (isNaN(quantity)) {
      return res.status(400).json({ message: "Quantity must be a number" });
    }

    const rowsUpdated = await knex("inventories")
      .where({ id: inventoryId })
      .update(req.body);
    if (rowsUpdated === 0) {
      return res
        .status(404)
        .json({ message: `inventory with ID ${inventoryId} not found` });
    }

    const updatedUser = await knex("inventories")
      .where({ id: inventoryId })
      .first();
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({
      message: `Unable to update user with ID ${req.params.id}: ${error}`,
    });
  }
};

const remove = async (req, res) => {
  try {
    const rowsDeleted = await knex("inventories")
      .where({ id: req.params.id })
      .delete();

    if (rowsDeleted === 0) {
      return res
        .status(404)
        .json({ message: `Inventory with ID ${req.params.id} not found` });
    }

    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({
      message: `Unable to delete inventory: ${error}`,
    });
  }
};

module.exports = {
  getInventories,
  createInventoryItem,
  getOne,
  remove,
  update,
};
