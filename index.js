const express = require('express')

const app = express()
const PORT = process.env.PORT || 3000

app.use("/api/interactions", require("./api/interactions"))

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
})