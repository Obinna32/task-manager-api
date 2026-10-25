const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema ({
    title: {
            type: String, 
            required: [true, 'A task must have a title'],
            trim: true, 
            minLength: [3, 'Task title must be at least 3 characters long'],
            maxLength: [100, 'Task title cannot exceed 100 characters']
        },
    description: { 
            type: String, 
            trim: true
        },
    status: { 
            type: String, 
            enum: {
                values: ['todo', 'in_progress', 'done'],
                message: "Status must either be: todo, in_progress, or done",
            },
            default: "todo"
        },
    priority: {
        type: String,
        enum: {
            values: ["low", 'medium', "high"],
            message: "Priority must be either: low, medium, or high"
        },
        default: "medium",
    },
    dueDate: {
        type: Date
    },
    tags: [String],
    owner: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: [true, 'A task must belong to an owner'],
        index: true
    },
    completedAt: {
        type: Date,
    }
},
{timestamps: true});

// Compound index for optimized filtering/sorting by owner, status, and due date
taskSchema.index({ owner: 1, status: 1, dueDate: 1});

// Text index across title and description for search functionality
taskSchema.index({ title: "text", description: "text"});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;