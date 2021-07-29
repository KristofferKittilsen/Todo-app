const mongoose = require("mongoose")
const validator = require("validator")

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error("Email is invalid")
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if(value < 0) {
                throw new Error("Age must be a positive number")
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value) {
            if(value.toLowerCase().includes("password")) {
                throw new Error('Password cannot contain "password"')
            }
        }
    },
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true,
    toJSON: {virituals: true},
    toObject: {virituals: true}
})

userSchema.virtual("tasks", {
    ref: "Task",
    localField: "_id",
    foreignField: "owner"
})

userSchema.virtual("tables", {
    ref: "Table",
    localField: "_id",
    foreignField: "owner"
})

const User = mongoose.model("User", userSchema)

module.exports = User