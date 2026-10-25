const express = require("express");
const taskController = require("../controllers/task.controller");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.use(protect);

router.route("/").post(taskController.createTask);

module.exports = router;