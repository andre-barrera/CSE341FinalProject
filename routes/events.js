const router = require("express").Router();
const eventsController = require("../controllers/events");

router.get("/", async (req, res) => {
    try {
        await eventsController.getAll(req, res);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch events"});
    }
});

router.get("/:id", async (req, res) => {
    try {
        await eventsController.getSingle(req, res);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch event" });
    }
});

router.post("/", async (req, res) => {
    try {
        if (Object.keys(req.body).length === 0) {
            return res.status(400).json({ message: "A body is required to create an event"});
        }
        await eventsController.createEvent(req, res);
    } catch (error) {
        res.status(500).json({ error: "Failed to create event" });
    }
});

router.put("/:id", async (req, res) => {
    try {
        if (Object.keys(req.body).length === 0) {
            return res.status(400).json({ message: "Update information is required"});
        }
        await eventsController.updateEvent(req, res);
    } catch (error) {
        res.status(500).json({ error: "Failed to update event" });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(400).json({ message: "An event ID is required in order to delete it"});
        }
        await eventsController.deleteEvent(req, res);
    } catch (error) {
        res.status(500).json({ error: "Failed to delete event"});
    }
});

module.exports = router;