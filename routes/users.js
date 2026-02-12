const router = require("express").Router();
const usersController = require("../controllers/users");

router.get("/", async (req, res) => {
    try {
        await usersController.getAll(req,res);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch users" });
    }
});

router.get("/:id", async (req, res) => {
    try {
        await usersController.getSingle(req, res); 
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch user"});
    }
});

router.post("/", async (req, res) => {
    try {
        if (Object.keys(req.body).length === 0) {
            return res.status(400).json({ message: "The request requires a body"});
        }
        await usersController.createUser(req, res);
    } catch (error) {
        res.status(500).json({ error: "Failed to create the user"});
    }
});

router.put("/:id", async (req, res) => {
    try {
        if(Object.keys(req.body).length === 0) {
            return res.status(400).json({ message: "The update request requires a body" });
        }
        await usersController.updateUser(req, res);
    } catch (error) {
        res.status(500).json({ message: "Failed to update the user"});
    }
});

router.delete("/:id", async (req, res) => {
    try {
        if(!req.params.id) {
            return res.status(400).json({ message: "The delete request reqires an ID"});
        }
        await usersController.deleteUser(req, res);
    } catch (error) {
        res.status(500).json({ message: "Failed to delete user"});
    }
});

module.exports = router;