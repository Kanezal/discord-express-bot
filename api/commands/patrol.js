const { SlashCommandBuilder } = require('discord.js');
const { sendDM } = require('../functions/sendto');
const { InteractionType, InteractionResponseType, InteractionResponseFlags } = require('discord-interactions')
require('dotenv').config();


const channel = "1067686380089655316";

module.exports = {
    async patrol(res, message) {
        let embed = {
			color: 0xe10e0e,
			title: `Рапорт: ${(message.data.options.find(obj => obj.name == "type").value == "patrol") ? "Патруль" : "Пост"}`,
			author: {
				name: message.user.username,
				icon_url: `https://cdn.discordapp.com/avatars/${message.user.id}/${message.user.avatar}.png`,
				url: `https://discord.com/users/${message.user.id}`
			},
			description: `Поставил: <@${message.user.id}>`,
			fields: [
				{ name: 'Место', value: message.data.options.find(obj => obj.name == 'location').value, inline: true },
				{ name: 'Срок', value: `${message.data.options.find(obj => obj.name == 'time').value} минут`, inline: true },
            ],
		};

		embed.fields.push(options.filter(
				obj => obj.includes("member")
			).map(
				(obj, idx) => Object.fromEntries([
					["name", `${idx + 1} боец`],
					["value", obj.value],
					["inline", true]
				])
			)
		);

		const headers = {
			'Content-Type': 'application/json',
			'Authorization': `Bot ${process.env.DISCORD_TOKEN}`
		};

		const body = JSON.stringify({embeds: [embed], attachments: Object.values(message.data.attachments)});


        await fetch(`https://discord.com/api/channels/${channel}/messages`, {
		  method: 'POST',
		  headers: headers,
		  body: body
		});
		
		res.send({
		  type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
		  data: {
			content: 'Рапорт был успешно отправлен.',
			flags: InteractionResponseFlags.EPHEMERAL
		  },
		});
		
		await sendDM(message.user.id, body);
    },

    data: new SlashCommandBuilder()
    .setName('patrol')
    .setDescription('Отправить рапорт о патрульно-постовой службе.')

    .addStringOption(option =>
        option.setName('type')
            .setRequired(true)
            .addChoices(
				{ name: "Патруль", value: "patrol" },
				{ name: "Пост", value: "sentry" }
			)
            .setDescription('Тип патрульно-постовой службы.')
	)
    
    .addStringOption(option =>
        option.setName('location')
            .setRequired(true)
            .setMinLength(2)
            .setMaxLength(20)
            .setDescription('Место патрулирования/поста.')
	)

	.addIntegerOption(option => 
		option.setName('time')
			.setRequired(true)
			.setDescription("Срок патруля/поста (в минутах)")
	)
	
	// Proof

	.addAttachmentOption(option =>
		option.setName("start_image")
			.setRequired(true)
			.setDescription("Скриншот заступления на пост/патруль")
	)

	.addAttachmentOption(option =>
		option.setName("proccess_image")
			.setRequired(true)
			.setDescription("Промежуточный скриншот поста/патруля")
	)

	.addAttachmentOption(option =>
		option.setName("end_image")
			.setRequired(true)
			.setDescription("Скриншот снятия с поста/патруля")
	)
	
	// Members

	.addUserOption(option =>
		option.setName("member")
			.setRequired(true)
			.setDescription("1 член патруля/поста")
	)

	.addUserOption(option =>
		option.setName("member2")
			.setDescription("2 член патруля/поста")
	)

	.addUserOption(option =>
		option.setName("member3")
			.setDescription("3 член патруля/поста")
	)

	.addUserOption(option =>
		option.setName("member4")
			.setDescription("4 член патруля/поста")
	)
}