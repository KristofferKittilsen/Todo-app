const mongoose = require("mongoose")

const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        trim: true
    },
    title: {
        type: String,
        required: true
    },
    labels: [{
        type: String
    }],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    table: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Table"
    }
}, {
    timestamps: true
})

const Task = mongoose.model("Task", taskSchema)

module.exports = Task
