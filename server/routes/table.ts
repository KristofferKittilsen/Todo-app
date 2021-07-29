import express from "express"
import Table from "../models/table"
import User from "../models/user"

const router = express.Router()

router.post("/", async (req: any, res) => {
    const table = new Table({
        ...req.body
    })

    try {
        await table.save()
        res.status(201).send(table)
    } catch(e) {
        res.status(400).send(e)
    }
})

router.get("/", async (req: any, res) => {
    try {
        const user = await User.findOne({email: req.user.email})
        req.user = user
        await req.user.populate({
            path: "tables"
        }).execPopulate()
        res.send(req.user.tables)
    } catch(e) {
        res.status(500).send(e)
    }
})

router.patch("/:id", async (req: any, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ["title"]

    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update)
    })

    if(!isValidOperation) {
        return res.status(400).send({error: "Invalid updates!"})
    }

    try {
        const table = await Table.findOne({_id: req.params.id, owner: req.user._id})

        if(!table) {
            return res.status(404).send()
        }

        updates.forEach((update) => {
            table[update] = req.body[update]
        })

        await table.save()
        res.send(table)
    } catch(e) {
        res.status(400).send(e)
    }
})

router.get("/:id", async (req: any, res) => {
    try {
        const table = await Table.findOne({_id: req.params.id})
        res.send(table)
    } catch(e) {
        res.status(404).send(e)
    }
})

router.delete("/:id", async (req: any, res) => {
    try {
        const table = await Table.findOneAndDelete({_id: req.params.id, owner: req.user._id})
        if(!table) {
            return res.status(404).send()
        }

        res.send(table)
    } catch(e) {
        res.status(500).send(e)
    }
})

const tableRoutes = router
export default tableRoutes