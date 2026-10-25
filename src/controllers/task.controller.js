const Task = require("../models/Task");
const APIFeatures = require("../utils/apiFeatures");
const catchAsync = require("../utils/catchAsync");

exports.createTask = catchAsync(async (req, res, next) => {
    req.body.owner = req.user._id;

    const newTask = await Task.create(req.body);

    res.status(201).json({status: "success", data: { task: newTask}});
});

exports.getAllTasks = catchAsync(async (req, res, next) => {
    
    const filter = { owner: req.user._id };

    const features = new APIFeatures(Task.find(filter), req.query).filter().search().sort().paginate();

    const tasks = await features.query;

    res.status(200).json({ status: "success", results: tasks.length, data: {tasks}});
});

exports.getTask = catchAsync(async (req, res, next) => {
    const task = await Task.findOne({ _id: req.params.id, owner: req.user._id});

    if (!task){
        return next(new AppError('No task found with that ID', 404));
    }

    res.status(200).json({ status: 'success', data: { task }});
});