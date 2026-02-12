const { ObjectId } = require("mongodb");
const mongodb = require("../data/database");

// GET ALL

const getAll = async (req, res) => {
  // #swagger.tags = ["Users"]
  try {
    const users = await mongodb
      .getDatabase()
      .db()
      .collection("users")
      .find()
      .toArray();

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// GET SINGLE

const getSingle = async (req, res) => {
  // #swagger.tags = ["Users"]
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    const userId = new ObjectId(req.params.id);

    const user = await mongodb
      .getDatabase()
      .db()
      .collection("users")
      .findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// CREATE

const createUser = async (req, res) => {
  // #swagger.tags = ["Users"]
  try {
    const { githubId, username, displayName } = req.body;

    if (!githubId || !username || !displayName) {
      return res.status(400).json({
        message: "githubId, username, and displayName are required"
      });
    }

    if (
      typeof githubId !== "string" ||
      typeof username !== "string" ||
      typeof displayName !== "string"
    ) {
      return res.status(400).json({
        message: "All fields must be strings"
      });
    }

    if (
      githubId.trim() === "" ||
      username.trim() === "" ||
      displayName.trim() === ""
    ) {
      return res.status(400).json({
        message: "Fields cannot be empty strings"
      });
    }

    const newUser = {
      githubId: githubId.trim(),
      username: username.trim(),
      displayName: displayName.trim(),
      createdAt: new Date()
    };

    const result = await mongodb
      .getDatabase()
      .db()
      .collection("users")
      .insertOne(newUser);

    res.status(201).json({
      message: "User created successfully",
      id: result.insertedId
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE USER

const updateUser = async (req, res) => {
  // #swagger.tags = ["Users"]
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    const userId = new ObjectId(req.params.id);
    const { githubId, username, displayName } = req.body;

    if (!githubId && !username && !displayName) {
      return res.status(400).json({
        message: "At least one field is required to update"
      });
    }

    const updates = {};

    if (githubId) {
      if (typeof githubId !== "string" || githubId.trim() === "") {
        return res.status(400).json({
          message: "githubId must be a non-empty string"
        });
      }
      updates.githubId = githubId.trim();
    }

    if (username) {
      if (typeof username !== "string" || username.trim() === "") {
        return res.status(400).json({
          message: "username must be a non-empty string"
        });
      }
      updates.username = username.trim();
    }

    if (displayName) {
      if (typeof displayName !== "string" || displayName.trim() === "") {
        return res.status(400).json({
          message: "displayName must be a non-empty string"
        });
      }
      updates.displayName = displayName.trim();
    }

    updates.updatedAt = new Date();

    const result = await mongodb
      .getDatabase()
      .db()
      .collection("users")
      .updateOne(
        { _id: userId },
        { $set: updates }
      );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(204).send();

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE 

const deleteUser = async (req, res) => {
  // #swagger.tags = ["Users"]
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    const userId = new ObjectId(req.params.id);

    const result = await mongodb
      .getDatabase()
      .db()
      .collection("users")
      .deleteOne({ _id: userId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(204).send();

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAll,
  getSingle,
  createUser,
  updateUser,
  deleteUser
};
