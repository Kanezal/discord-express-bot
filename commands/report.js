const { SlashCommandBuilder } = require('discord.js');
const { InteractionType, InteractionResponseType, InteractionResponseFlags } = require('discord-interactions')
const { clientId, guildId, report_channels, ranks, punishTypes, disciplinaryChannelId } = require('../config.json');

const { isGuardCheck } = require('../functions/checks')


module.exports = {
    report(res, message) {
		// TODO: Неправильная реакция на отправку сообщения в дисе гвардии
        if (!isGuardCheck(message)) {
			res.send({
				type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
				data: {
					content: 'Попробуйте написать рапорт используя любой доступный вам канал в дискорде гвардии.',
					flags: InteractionResponseFlags.EPHEMERAL
				},
			});
		}
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