const Task = require("../models/Task");
const catchAsync = require("../utils/catchAsync");

exports.createTask = catchAsync(async (req, res, next) => {
    req.body.owner = req.user._id;

    const newTask = await Task.create(req.body);

    res.status(201).json({status: "success", data: { task: newTask}});
});