const { ObjectId } = require("mongodb");
const mongodb = require("../data/database");

// GET ALL
const getAll = async (req, res) => {
  // #swagger.tags = ["Registrations"]
  try {
    const registrations = await mongodb
      .getDatabase()
      .db()
      .collection("registration")
      .find()
      .toArray();

    res.status(200).json(registrations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET SINGLE
const getSingle = async (req, res) => {
  // #swagger.tags = ["Registrations"]
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid registration ID format" });
    }

    const registrationId = new ObjectId(req.params.id);

    const registration = await mongodb
      .getDatabase()
      .db()
      .collection("registration")
      .findOne({ _id: registrationId });

    if (!registration) {
      return res.status(404).json({ message: "Registration not found" });
    }

    res.status(200).json(registration);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// CREATE
const createRegistration = async (req, res) => {
  // #swagger.tags = ["Registrations"]
  try {
    const { eventId, locationId, attendeeName, status } = req.body;

    if (!eventId || !locationId || !attendeeName || !status) {
      return res.status(400).json({
        message: "eventId, locationId, attendeeName, and status are required"
      });
    }

    if (
      !ObjectId.isValid(eventId) ||
      !ObjectId.isValid(locationId)
    ) {
      return res.status(400).json({
        message: "eventId and locationId must be valid ObjectIds"
      });
    }

    if (
      typeof attendeeName !== "string" ||
      typeof status !== "string"
    ) {
      return res.status(400).json({
        message: "attendeeName and status must be strings"
      });
    }

    if (attendeeName.trim() === "" || status.trim() === "") {
      return res.status(400).json({
        message: "Fields cannot be empty"
      });
    }

    const newRegistration = {
      eventId: new ObjectId(eventId),
      locationId: new ObjectId(locationId),
      attendeeName: attendeeName.trim(),
      status: status.trim(),
      createdAt: new Date()
    };

    const result = await mongodb
      .getDatabase()
      .db()
      .collection("registration")
      .insertOne(newRegistration);

    res.status(201).json({
      message: "Registration created successfully",
      id: result.insertedId
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE
const updateRegistration = async (req, res) => {
  // #swagger.tags = ["Registrations"]
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid registration ID format" });
    }

    const registrationId = new ObjectId(req.params.id);
    const { attendeeName, status } = req.body;

    if (!attendeeName && !status) {
      return res.status(400).json({
        message: "At least one field is required to update"
      });
    }

    const updates = {};

    if (attendeeName) {
      if (typeof attendeeName !== "string" || attendeeName.trim() === "") {
        return res.status(400).json({
          message: "attendeeName must be a non-empty string"
        });
      }
      updates.attendeeName = attendeeName.trim();
    }

    if (status) {
      if (typeof status !== "string" || status.trim() === "") {
        return res.status(400).json({
          message: "status must be a non-empty string"
        });
      }
      updates.status = status.trim();
    }

    updates.updatedAt = new Date();

    const result = await mongodb
      .getDatabase()
      .db()
      .collection("registration")
      .updateOne({ _id: registrationId }, { $set: updates });

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Registration not found" });
    }

    res.status(204).send();

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE
const deleteRegistration = async (req, res) => {
  // #swagger.tags = ["Registrations"]
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid registration ID format" });
    }

    const registrationId = new ObjectId(req.params.id);

    const result = await mongodb
      .getDatabase()
      .db()
      .collection("registration")
      .deleteOne({ _id: registrationId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Registration not found" });
    }

    res.status(204).send();

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAll,
  getSingle,
  createRegistration,
  updateRegistration,
  deleteRegistration
};
