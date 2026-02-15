const router = require("express").Router();
const registrationsController = require("../controllers/registrations");

// GET ALL REGISTRATIONS
router.get("/", async (req, res) => {
  try {
    await registrationsController.getAll(req, res);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch registrations" });
  }
});

// GET SINGLE REGISTRATION
router.get("/:id", async (req, res) => {
  try {
    await registrationsController.getSingle(req, res);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch registration" });
  }
});

// CREATE REGISTRATION
router.post("/", async (req, res) => {
  try {
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "A body is required to create a registration" });
    }
    await registrationsController.createRegistration(req, res);
  } catch (error) {
    res.status(500).json({ error: "Failed to create registration" });
  }
});

// UPDATE REGISTRATION
router.put("/:id", async (req, res) => {
  try {
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "Update information is required" });
    }
    await registrationsController.updateRegistration(req, res);
  } catch (error) {
    res.status(500).json({ error: "Failed to update registration" });
  }
});

// DELETE REGISTRATION
router.delete("/:id", async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ message: "A registration ID is required to delete it" });
    }
    await registrationsController.deleteRegistration(req, res);
  } catch (error) {
    res.status(500).json({ error: "Failed to delete registration" });
  }
});

module.exports = router;
