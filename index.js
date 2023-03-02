const { verifyKeyMiddleware, InteractionType, InteractionResponseType } = require('discord-interactions')
const { publicKey } = require("./config.json")
const express = require('express')


const commands = {}
const normalizedPath = require("path").join(__dirname, "commands");
require("fs").readdirSync(normalizedPath).forEach(function (file) {
    commands[file.slice(0, -3)] = require("./commands/" + file)[file.slice(0, -3)]
});


const app = express()
const port = 3000

app.post('/', (req, res) => {
    res.send('Hello World!')
})

app.post('/interactions', verifyKeyMiddleware(publicKey), (req, res) => {
    const message = req.body;
    if (message.type === InteractionType.APPLICATION_COMMAND) {
        commands[message.data.name](res, message)
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})