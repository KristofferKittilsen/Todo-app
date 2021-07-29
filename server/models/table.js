const mongoose = require("mongoose")

const tableSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        requred: true,
        ref: "User"
    }
}, {
    timestamps: true,
    toJSON: {virituals: true},
    toObject: {virituals: true}
})

tableSchema.virtual("tasks", {
    ref: "Task",
    localField: "_id",
    foreignField: "table"
})

const Table = mongoose.model("Table", tableSchema)

module.exports = Table