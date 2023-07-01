const { verifyKeyMiddleware, InteractionType } = require('discord-interactions')
const { publicKey } = require("../config.json")
const { isGuard } = require("../api/functions/checks")
const router = require('express').Router()

const commands = {}
const normalizedPath = require("path").join(__dirname, "commands");
require("fs").readdirSync(normalizedPath).forEach(function (file) {
    commands[file.slice(0, -3)] = require("./commands/" + file)[file.slice(0, -3)]
});

/**
 * POST reports
 * 
 * @return message to user
 */
router.post('/', verifyKeyMiddleware(publicKey), async (req, res) => {
    const message = req.body;
    if (message.type === InteractionType.APPLICATION_COMMAND) {
        if (!isGuard)
            return undefined

        await commands[message.data.name](res, message)
    }
});


module.exports = router;