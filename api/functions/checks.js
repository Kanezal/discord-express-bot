const { guardRoleId, guardGuildId } = require("../../config.json")
require('dotenv').config()

module.exports = {
    async isGuardCheck(message) {
        // if (message.member != undefined) {
        //     return false
        // }

        const response = await fetch(`https://discord.com/api/guilds/${guardGuildId}/members/${message.user.id}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bot ${process.env.DISCORD_TOKEN}`
			},
		})

        data = await response.json()
        if (data.code == 10013) {
            return false
        }
        return data.roles.includes(guardRoleId)
    },

    async isGuard(message) {
        if (!(await isGuardCheck(message))) {
            res.send({
                type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                data: {
                    content: 'Доступ запрещен. Неавторизованное лицо, попытка проникновения в базу данных гвардии карается согласно уставу ВАР.',
                    flags: InteractionResponseFlags.EPHEMERAL
                },
            });
            return false
        }
        return true
    }
}