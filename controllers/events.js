const { ObjectId } = require("mongodb");
const mongodb = require("../data/database");


// GET ALL

const getAll = async (req, res) => {
  // #swagger.tags = ['Events']
  try {
    const events = await mongodb
      .getDatabase()
      .db()
      .collection("events")
      .find()
      .toArray();

    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET SINGLE

const getSingle = async (req, res) => {
  // #swagger.tags = ['Events']
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid event ID" });
    }

    const eventId = new ObjectId(req.params.id);

    const event = await mongodb
      .getDatabase()
      .db()
      .collection("events")
      .findOne({ _id: eventId });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// CREATE 

const createEvent = async (req, res) => {
  // #swagger.tags = ['Events']
  try {
    const {
      title,
      description,
      date,
      time,
      locationName,
      locationAddress,
      createdByGithubId,
      createdByUsername
    } = req.body;

    if (
      !title ||
      !description ||
      !date ||
      !time ||
      !locationName ||
      !locationAddress ||
      !createdByGithubId ||
      !createdByUsername
    ) {
      return res.status(400).json({
        message: "All event fields are required"
      });
    }

    if (
      typeof title !== "string" ||
      typeof description !== "string" ||
      typeof time !== "string" ||
      typeof locationName !== "string" ||
      typeof locationAddress !== "string" ||
      typeof createdByGithubId !== "string" ||
      typeof createdByUsername !== "string"
    ) {
      return res.status(400).json({
        message: "All fields must be strings"
      });
    }

    if (
      title.trim() === "" ||
      description.trim() === "" ||
      time.trim() === "" ||
      locationName.trim() === "" ||
      locationAddress.trim() === "" ||
      createdByGithubId.trim() === "" ||
      createdByUsername.trim() === ""
    ) {
      return res.status(400).json({
        message: "Fields cannot be empty strings"
      });
    }

    if (typeof date !== "string" || isNaN(Date.parse(date))) {
      return res.status(400).json({
        message: "Invalid date format"
      });
    }

    const newEvent = {
      title: title.trim(),
      description: description.trim(),
      date,
      time: time.trim(),
      locationName: locationName.trim(),
      locationAddress: locationAddress.trim(),
      createdByGithubId: createdByGithubId.trim(),
      createdByUsername: createdByUsername.trim(),
      createdAt: new Date()
    };

    const result = await mongodb
      .getDatabase()
      .db()
      .collection("events")
      .insertOne(newEvent);

    res.status(201).json({
      message: "Event created successfully",
      id: result.insertedId
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE 

const updateEvent = async (req, res) => {
  // #swagger.tags = ['Events']
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid event ID" });
    }

    const eventId = new ObjectId(req.params.id);
    const updates = req.body;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        message: "At least one field is required to update"
      });
    }

    const allowedFields = [
      "title",
      "description",
      "date",
      "time",
      "locationName",
      "locationAddress",
      "createdByGithubId",
      "createdByUsername"
    ];

    const updateData = {};

    for (const key of Object.keys(updates)) {
      if (!allowedFields.includes(key)) {
        return res.status(400).json({
          message: `Invalid field: ${key}`
        });
      }

      if (key === "date") {
        if (typeof updates.date !== "string" || isNaN(Date.parse(updates.date))) {
          return res.status(400).json({
            message: "Invalid date format"
          });
        }
        updateData.date = updates.date;
      } else {
        if (
          typeof updates[key] !== "string" ||
          updates[key].trim() === ""
        ) {
          return res.status(400).json({
            message: `${key} must be a non-empty string`
          });
        }
        updateData[key] = updates[key].trim();
      }
    }

    updateData.updatedAt = new Date();

    const result = await mongodb
      .getDatabase()
      .db()
      .collection("events")
      .updateOne(
        { _id: eventId },
        { $set: updateData }
      );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(204).send();

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//  DELETE

const deleteEvent = async (req, res) => {
  // #swagger.tags = ['Events']
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid event ID" });
    }

    const eventId = new ObjectId(req.params.id);

    const result = await mongodb
      .getDatabase()
      .db()
      .collection("events")
      .deleteOne({ _id: eventId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(204).send();

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAll,
  getSingle,
  createEvent,
  updateEvent,
  deleteEvent
};
