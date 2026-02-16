const { ObjectId } = require("mongodb");
const mongodb = require("../data/database");

// GET ALL
const getAll = async (req, res) => {
  // #swagger.tags = ["Locations"]
  try {
    const locations = await mongodb
      .getDatabase()
      .db()
      .collection("location")
      .find()
      .toArray();

    res.status(200).json(locations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET SINGLE
const getSingle = async (req, res) => {
  // #swagger.tags = ["Locations"]
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid location ID format" });
    }

    const locationId = new ObjectId(req.params.id);

    const location = await mongodb
      .getDatabase()
      .db()
      .collection("location")
      .findOne({ _id: locationId });

    if (!location) {
      return res.status(404).json({ message: "Location not found" });
    }

    res.status(200).json(location);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// CREATE
const createLocation = async (req, res) => {
  // #swagger.tags = ["Locations"]
  try {
    const { name, city, capacity } = req.body;

    if (!name || !city || capacity === undefined) {
      return res.status(400).json({
        message: "name, city, and capacity are required"
      });
    }

    if (
      typeof name !== "string" ||
      typeof city !== "string" ||
      typeof capacity !== "number"
    ) {
      return res.status(400).json({
        message: "name and city must be strings, capacity must be a number"
      });
    }

    if (name.trim() === "" || city.trim() === "") {
      return res.status(400).json({
        message: "name and city cannot be empty"
      });
    }

    const newLocation = {
      name: name.trim(),
      city: city.trim(),
      capacity,
      createdAt: new Date()
    };

    const result = await mongodb
      .getDatabase()
      .db()
      .collection("location")
      .insertOne(newLocation);

    res.status(201).json({
      message: "Location created successfully",
      id: result.insertedId
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE
const updateLocation = async (req, res) => {
  // #swagger.tags = ["Locations"]
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid location ID format" });
    }

    const locationId = new ObjectId(req.params.id);
    const { name, city, capacity } = req.body;

    if (!name && !city && capacity === undefined) {
      return res.status(400).json({
        message: "At least one field is required to update"
      });
    }

    const updates = {};

    if (name) {
      if (typeof name !== "string" || name.trim() === "") {
        return res.status(400).json({
          message: "name must be a non-empty string"
        });
      }
      updates.name = name.trim();
    }

    if (city) {
      if (typeof city !== "string" || city.trim() === "") {
        return res.status(400).json({
          message: "city must be a non-empty string"
        });
      }
      updates.city = city.trim();
    }

    if (capacity !== undefined) {
      if (typeof capacity !== "number") {
        return res.status(400).json({
          message: "capacity must be a number"
        });
      }
      updates.capacity = capacity;
    }

    updates.updatedAt = new Date();

    const result = await mongodb
      .getDatabase()
      .db()
      .collection("location")
      .updateOne({ _id: locationId }, { $set: updates });

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Location not found" });
    }

    res.status(204).send();

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE
const deleteLocation = async (req, res) => {
  // #swagger.tags = ["Locations"]
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid location ID format" });
    }

    const locationId = new ObjectId(req.params.id);

    const result = await mongodb
      .getDatabase()
      .db()
      .collection("location")
      .deleteOne({ _id: locationId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Location not found" });
    }

    res.status(204).send();

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAll,
  getSingle,
  createLocation,
  updateLocation,
  deleteLocation
};
