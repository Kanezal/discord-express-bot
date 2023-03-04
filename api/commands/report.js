const { SlashCommandBuilder } = require('discord.js');
const { InteractionType, InteractionResponseType, InteractionResponseFlags } = require('discord-interactions')
const { clientId, guildId, report_channels, ranks, punishTypes, disciplinaryChannelId } = require('../../config.json');
require('dotenv').config()

const { isGuardCheck } = require('../functions/checks')


module.exports = {
    async report(res, message) {
        if (!(await isGuardCheck(message))) {
			res.send({
				type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
				data: {
					content: 'Доступ запрещен. Неавторизованное лицо, попытка проникновения в базу данных гвардии карается согласно уставу ВАР.',
					flags: InteractionResponseFlags.EPHEMERAL
				},
			});
			return;
		}

		if (message.data.options.find(obj => obj.name == "steamid").value.slice(0,6) !== "STEAM_") {
			res.send({
				type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
				data: {
					content: 'STEAM:ID указан неверно!',
					flags: InteractionResponseFlags.EPHEMERAL
				},
			});
			return;
		}

		const legionID = message.data.options.find(obj => obj.name == "legion").value
		const legionName = report_channels.find(obj => obj.value == legionID).name
		
		if (message.data.options.find(obj => obj.name == "punish_type").value == 'arrest') {
			if (message.data.options.find(obj => obj.name == "terms") > 10) {
				res.send({
					type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
					data: {
						content: 'Слишком высокое наказание. Обратитесь к старшему.',
						flags: InteractionResponseFlags.EPHEMERAL
					},
				});
				return;
			}

			var channel = message.data.options.find(obj => obj.name == "legion").value
		} else {

			if (legionName == "SOB") {
				res.send({
					type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
					data: {
						content: 'Дисциплинарное взыскание к бойцу SOB невозможно. Обратитесь к старшему.',
						flags: InteractionResponseFlags.EPHEMERAL
					},
				});
				return;
			}

			var channel = disciplinaryChannelId
		}

		const punishType = message.data.options.find(obj => obj.name == "punish_type").value

		const embed = {
			color: 0xe10e0e,
			title: `Рапорт: ${punishTypes.find(obj => obj.value == punishType).name}`,
			author: {
				name: message.member.user.username,
				icon_url: `https://cdn.discordapp.com/avatars/${message.member.user.id}/${message.member.user.avatar}.png`,
				url: `https://discord.com/users/${message.member.user.id}`
			},
			description: `<@${message.member.user.id}>`,
			fields: [
				{ name: 'IDN', value: message.data.options.find(obj => obj.name == 'idn').value, inline: true },
				{ name: 'Легион', value: legionName, inline: true },
				{ name: 'Звание', value: message.data.options.find(obj => obj.name == 'rank').value, inline: true },
				{ name: 'Позывной (Имя)', value: message.data.options.find(obj => obj.name == 'name').value, inline: true },
				{ name: 'STEAM:ID', value: message.data.options.find(obj => obj.name == 'steamid').value, inline: true },
				{ name: 'Кол-во мер наказания', value: message.data.options.find(obj => obj.name == 'terms').value.toString(), inline: true},
				{ name: 'Описание нарушения', value: message.data.options.find(obj => obj.name == 'description').value }
			],
			image: {
				url: message.data.resolved.attachments[
					message.data.options.find(obj => obj.name == 'image').value
				].url
			}
		}
		
		fetch(`https://discord.com/api/channels/${channel}/messages`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bot ${process.env.DISCORD_TOKEN}`
			},
			body: JSON.stringify({embeds: [embed]})
		}).then(resLoc => {
			res.send({
				type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
				data: {
					content: 'Рапорт успешно отправлен. Дублирую отправленный вам рапорт для личного дела.',
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

		fetch(`https://discord.com/api/channels/${message.channel_id}/messages`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bot ${process.env.DISCORD_TOKEN}`
			},
			body: JSON.stringify({embeds: [embed]})
		})
    },
    
    data: new SlashCommandBuilder()
    .setName('report')
    .setDescription('Отправить рапорт о наказании.')

		.addStringOption(option =>
			option.setName('punish_type')
				.setDescription('Тип наказания.')
				.setRequired(true)
				.addChoices(
					...punishTypes
				))

		.addStringOption(option =>
			option.setName('idn')
				.setRequired(true)
				.setMinLength(2)
				.setMaxLength(4)
				.setDescription('IDN нарушителя. Пишем даже если не существует: Джедай, Мандо. Отряды БСО имеют только 2 цифры.'))

		.addStringOption(option =>
			option.setName('legion')
				.setDescription('Л/Б/К нарушителя.')
				.setRequired(true)
				.addChoices(
					...report_channels
				))
		
		.addStringOption(option =>
			option.setName('rank')
				.setDescription('Звание нарушителя. Ставим прочерк если нет.')
				.setRequired(true)
				.setChoices(...ranks))

		.addStringOption(option =>
			option.setName('name')
				.setRequired(true)
				.setDescription('Позывной/имяфамилия нарушителя.'))
			
		.addStringOption(option => 
			option.setName('steamid')
				.setDescription('Идентификатор Steam:ID нарушителя.')
				.setRequired(true)
				.setMinLength(15))
			
		.addAttachmentOption(option =>
			option.setName('image')
				.setRequired(true)
				.setDescription('Фото с нарушителем. Если боец состоит в БСО, то вы должны действовать согласно иструкции.'))

		.addIntegerOption(option => 
			option.setName('terms')
				.setDescription('Количество единиц наказания.')
				.setRequired(true)
				.setMinValue(1)
				.setMaxValue(1001))

		.addStringOption(option => 
			option.setName('description')
				.setDescription('Опишите нарушения, приложите ссылки.')
				.setRequired(true)),

}