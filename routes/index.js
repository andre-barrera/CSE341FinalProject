const router = require("express").Router();

router.get("/", (req, res) => {
    res.status(201).send("Welcome to Events Planner");
});

router.use("/users", require("./users"));
router.use("/events", require("./events"));
router.use("/registration", require("./registrations"));
router.use("/locations", require("./locations"));


module.exports = router;
