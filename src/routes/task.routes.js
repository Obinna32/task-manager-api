const express = require("express");
const taskController = require("../controllers/task.controller");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.use(protect);

router.route("/").get(taskController.getAllTasks).post(taskController.createTask);

router.route("/:id").get(taskController.getTask).patch(taskController.updateTask).delete(taskController.deleteTask);

module.exports = router;