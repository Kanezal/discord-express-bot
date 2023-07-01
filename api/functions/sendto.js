const { guardRoleId, guardGuildId } = require("../../config.json")
require('dotenv').config()

module.exports = {
    async sendDM(user, body) {
        const resDm = await fetch('https://discord.com/api/users/@me/channels', {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({ recipient_id: user })
        });
        
        const dmChannel = await resDm.json();
        
        return await fetch(`https://discord.com/api/channels/${dmChannel.id}/messages`, {
              method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bot ${process.env.DISCORD_TOKEN}`
            },
              body: body
        });
    }
}