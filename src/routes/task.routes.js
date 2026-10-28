const express = require("express");
const taskController = require("../controllers/task.controller");
const { protect } = require("../middleware/auth");
const validate = require("../middleware/validate");
const { createTaskSchema, updateTaskSchema } = require("../validators/task.schema");

const router = express.Router();

router.use(protect);

router.route("/").get(taskController.getAllTasks).post(validate(createTaskSchema), taskController.createTask);

router.route("/:id").get(taskController.getTask).patch(validate(updateTaskSchema), taskController.updateTask).delete(taskController.deleteTask);

module.exports = router;