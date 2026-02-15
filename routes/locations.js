const router = require("express").Router();
const locationsController = require("../controllers/locations");

// GET ALL LOCATIONS
router.get("/", async (req, res) => {
  try {
    await locationsController.getAll(req, res);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch locations" });
  }
});

// GET SINGLE LOCATION
router.get("/:id", async (req, res) => {
  try {
    await locationsController.getSingle(req, res);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch location" });
  }
});

// CREATE LOCATION
router.post("/", async (req, res) => {
  try {
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "A body is required to create a location" });
    }
    await locationsController.createLocation(req, res);
  } catch (error) {
    res.status(500).json({ error: "Failed to create location" });
  }
});

// UPDATE LOCATION
router.put("/:id", async (req, res) => {
  try {
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "Update information is required" });
    }
    await locationsController.updateLocation(req, res);
  } catch (error) {
    res.status(500).json({ error: "Failed to update location" });
  }
});

// DELETE LOCATION
router.delete("/:id", async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ message: "A location ID is required to delete it" });
    }
    await locationsController.deleteLocation(req, res);
  } catch (error) {
    res.status(500).json({ error: "Failed to delete location" });
  }
});

module.exports = router;
