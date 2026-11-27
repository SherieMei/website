
const express = require("express");
const router = express.Router();
const gardenController = require("../controllers/gardenController");

router.get("/", gardenController.getGarden);

router.put("/name", gardenController.updateName);

router.post("/ideas", gardenController.addIdea);

router.put("/ideas/:ideaId", gardenController.updateIdea);

router.post("/tasks", gardenController.addTask);

module.exports = router;

router.delete("/ideas/:ideaId", gardenController.deleteIdea);
router.put("/tasks/:taskId", gardenController.updateTask);
router.delete("/tasks/:taskId", gardenController.deleteTask);