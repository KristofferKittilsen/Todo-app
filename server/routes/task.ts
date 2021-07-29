import express from "express"
import Task from "../models/task"
import User from "../models/user"
import Table from "../models/table"

const router = express.Router()

router.post("/", async (req: any, res) => {
    const task = new Task({
        ...req.body
    })

    try {
        await task.save()
        res.status(201).send(task)
    } catch(e) {
        res.status(400).send(e)
    }
})

router.get("/", async (req: any, res) => {
    try {
        const user = await User.findOne({email: req.user.email})
        req.user = user
        await req.user.populate({
            path: "tasks"
        }).execPopulate()
        res.send(req.user.tasks)
    } catch(e) {
        res.status(500).send(e)
    }
})

router.get("/:id", async (req: any, res) => {
    try {
        const task = await Task.findOne({_id: req.params.id})
        res.send(task)
    } catch(e) {
        res.status(404).send(e)
    }
})

router.patch("/:id", async (req: any, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ["description", "title", "labels", "table"]

    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update)
    })

    if(!isValidOperation) {
        return res.status(400).send({error: "Invalid updates!"})
    }

    try {
        const task = await Task.findOne({_id: req.params.id, owner: req.user._id})

        if(!task) {
            return res.status(404).send()
        }

        updates.forEach((update) => {
            task[update] = req.body[update]
        })

        await task.save()
        res.send(task)
    } catch(e) {
        res.status(400).send(e)
    }
})

router.delete("/:id", async (req: any, res) => {
    try {
        const task = await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id})

        if(!task) {
            return res.status(404).send()
        }

        res.send(task)
    } catch(e) {
        res.status(500).send()
        console.log(e)
    }
})

const taskRoutes = router
export default taskRoutes