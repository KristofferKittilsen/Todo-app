import express from "express"
import "../db/mongoose"

const router = express.Router()

router.get("/", (req, res) => {
    res.send({title: "Something", description: "Something else"})
})

const indexRoutes = router
export default indexRoutes