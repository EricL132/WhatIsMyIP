const express = require("express")
const app = express()
const router = express.Router()
const PORT = process.env.PORT || 8000
const fetch = require("node-fetch")


app.use("/api", router)
router.get("/ip/*", (req, res) => {
    const path = req.path.split("/")[2]
    fetch(`http://ip-api.com/json/${path}`).then((res) => res.json()).then((data) => {
        if (data.status === "fail") return res.status(400).end()
        return res.status(200).send(data)
    })
})

router.get("/ip", (req, res) => {
    fetch(`http://ip-api.com/json/`).then((res) => res.json()).then((data) => {
        if (data.status === "fail") return res.status(400).end()
        return res.status(200).send(data)
    })
})


app.listen(PORT, () => {
    console.log("listening to port: " + PORT)
})
