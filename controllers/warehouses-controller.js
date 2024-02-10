const { resolve4 } = require("dns");

const knex = require("knex")(require("../knexfile"));

//to get list of warehouses
const getWarehouses = async (_req, res) => {
  try {
    const data = await knex("warehouses")
      .select(
        "warehouses.id",
        "warehouses.warehouse_name",
        "warehouses.address",
        "warehouses.city",
        "warehouses.country",
        "warehouses.contact_name",
        "warehouses.contact_position",
        "warehouses.contact_phone",
        "warehouses.contact_email"
      )
      .innerJoin("inventories", "inventories.warehouse_id", "inventories.id")
      .orderBy("id");
    res.status(200).json(data);
  } catch (err) {
    res.status(400).send(`Error retrieving warehouses: ${err}`);
  }
};

//to get a single warehouse
const findOne = async (req, res) => {
  try {
    const warehousesFound = await knex("warehouses").where({
      id: req.params.id,
    });

    if (warehousesFound.length === 0) {
      return res.status(404).json({
        message: `Warehouse with ID ${req.params.id} not found`,
      });
    }

    const warehouseData = warehousesFound[0];
    res.json(warehouseData);
  } catch (error) {
    res.status(500).json({
      message: `Unable to retrieve warehouse data for warehouse with ID ${req.params.id}`,
    });
  }
};

//to add a new warehouse
const add = async (req, res) => {
  const {
    warehouse_name,
    address,
    city,
    country,
    contact_name,
    contact_position,
    contact_phone,
    contact_email,
  } = req.body;
  if (
    !warehouse_name ||
    !address ||
    !city ||
    !country ||
    !contact_name ||
    !contact_position ||
    !contact_phone ||
    !contact_email
  ) {
    return res.status(400).json({
      message: "Please filled in all the required information",
    });
  }

  try {
    if (
      !/^(\+\d{1,3}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/.test(
        req.body.contact_phone
      )
    ) {
      return res
        .status(400)
        .json({ message: "You've entered an invalid phone number" });
    }
    if (!/\S+@\S+\.\S+/.test(req.body.contact_email)) {
      return res
        .status(400)
        .json({ message: "You've entered an invalid email address" });
    }

    const newWarehouse = {
      warehouse_name,
      address,
      city,
      country,
      contact_name,
      contact_position,
      contact_phone,
      contact_email,
    };
    const [newWarehouseId] = await knex("warehouses").insert(newWarehouse);

    const createdWarehouse = await knex("warehouses")
      .where("id", newWarehouseId)
      .first();
    res.status(201).json(createdWarehouse);
  } catch (error) {
    res.status(500).json({
      message: `Unable to create new warehouses: ${error}`,
    });
  }
};

//to edit a warehouse
const edit = async (req, res) => {
  try {
    const {
      warehouse_name,
      address,
      city,
      country,
      contact_name,
      contact_position,
      contact_phone,
      contact_email,
    } = req.body;
    const id = parseInt(req.params.id);

    if (
      !warehouse_name ||
      !address ||
      !city ||
      !country ||
      !contact_name ||
      !contact_position ||
      !contact_phone ||
      !contact_email
    ) {
      return res.status(400).json({
        message:
          "Please ensure that all inputs are complete, even those that will remain the same",
      });
    }

    let existingWarehouse = await knex("warehouses").where({ id }).first();
    if (!existingWarehouse) {
      await knex("warehouses").insert({
        id,
        warehouse_name,
        address,
        city,
        country,
        contact_name,
        contact_position,
        contact_phone,
        contact_email,
      });
      existingWarehouse = {
        id,
        warehouse_name,
        address,
        city,
        country,
        contact_name,
        contact_position,
        contact_phone,
        contact_email,
      };
      return res.status(200).json(existingWarehouse);
    } else {
      await knex("warehouses").where({ id }).update({
        warehouse_name,
        address,
        city,
        country,
        contact_name,
        contact_position,
        contact_phone,
        contact_email,
      });
    }

    res.status(200).json(existingWarehouse);
  } catch (error) {
    console.error("Error updating warehouse:", error);
    res.status(500).json({
      message: "Unable to update selected warehouse",
    });
  }
}

//to delete a warehouse
const remove = async (req, res) => {
  try {

    const id = parseInt(req.params.id)

    // const warehouseDeleted = await knex("warehouse")
    //   .where({id: req.params.id})
    //   .delete()

      // if (warehouseDeleted === 0) {
        if (isNaN(id)) {
        return res
        .status(404)
        .json({message: `Warehouse with Id ${req.params.id} not found`})
      }

      const warehouseDeleted = await knex("warehouse")
      .where({id: id})
      .del()

      if (warehouseDeleted === 0) {
        return res.status(404).json({message: `Warehouse with ID ${id} cannot be found`})
      }

      res.sendStatus(204)
  } catch (error) {
    res.status(500).json({
      message: `Unable to delete warehouse: ${error.message}`
    })
  }
}
 


//to get the inventory list of a given warehouse
const warehouseInventory = async (req, res) => {
  try {
    const warehouseInventoryFound = await knex("inventories")
      .select("id", "item_name", "category", "status", "quantity")
      .where({
        warehouse_id: req.params.id,
      });

    res.status(200).json(warehouseInventoryFound);
  } catch (error) {
    res
      .status(404)
      .send(`inventory for selected warehouse ${req.params.id} not found`);
  }
};

module.exports = {
  getWarehouses,
  findOne,
  add,
  remove,
  edit,
  warehouseInventory,
};
