const { SlashCommandBuilder } = require('discord.js');
const { InteractionType, InteractionResponseType, InteractionResponseFlags } = require('discord-interactions')
require('dotenv').config()


const channel = "1065211593299853322"

module.exports = {
    async manhunt(res, message) {
        const embed = {
			color: 0xe10e0e,
			title: `Розыск:`,
			author: {
				name: message.user.username,
				icon_url: `https://cdn.discordapp.com/avatars/${message.user.id}/${message.user.avatar}.png`,
				url: `https://discord.com/users/${message.user.id}`
			},
			description: `<@${message.user.id}>`,
			fields: [
				{ name: 'Данные', value: message.data.options.find(obj => obj.name == 'marks').value },
				{ name: 'Причина', value: message.data.options.find(obj => obj.name == 'reason').value },
            ],
		}


        fetch(`https://discord.com/api/channels/${channel}/messages`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bot ${process.env.DISCORD_TOKEN}`
			},
			body: JSON.stringify({embeds: [embed]})
		}).then(async resLoc => {
			res.send({
				type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
				data: {
					content: 'Объявление в розыск было успешно отправлено.',
					flags: InteractionResponseFlags.EPHEMERAL
				},
			});
		}).catch(err => {
			res.send({
				type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
				data: {
					content: `Произошла неизвестная ошибка:\n${err}`,
					flags: InteractionResponseFlags.EPHEMERAL
				},
			});
			return;
		})
    },

    data: new SlashCommandBuilder()
    .setName('manhunt')
    .setDescription('Объявить в розыск.')

    .addStringOption(option =>
        option.setName('marks')
            .setRequired(true)
            .setMinLength(5)
            .setMaxLength(60)
            .setDescription('Всё что известно о цели. Суда можно написать также и данные в формате IDN | Легион | Позывной.'))
    
    .addStringOption(option =>
        option.setName('reason')
            .setRequired(true)
            .setMinLength(4)
            .setMaxLength(120)
            .setDescription('Причина объявления розыска.'))
}