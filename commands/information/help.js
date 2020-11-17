module.exports = {
    aliases: ['v', 'ver'],
    run: (message, args, text, client, prefix, instance) => {
        const config = require('../config.json');
        const Discord = require('discord.js');
        const embed = {
            title: 'Karesz',
            description: '**Command**\n*Usage*',
            thumbnail: {url: config.karesz.pfp},

            fields: [
                // {name: 'Command name', value: 'usage\n\n'},
                {name: 'Clear', value: 'clear <amount>'},
                {name: 'Poll', value: 'poll <message>'},
                {name: 'Kill', value: 'kill <@someone>'},
                {name: 'Profilepic', value: 'pfp <@someone>'},
                {name: 'Serverinfo', value: 'info'}
            ],
            timestamp: new Date(),
            footer: {
                text: message.author.tag
            }
        }
        message.channel.send({embed: embed})

        client.guilds.cache.get(config.testServer).channels.cache.get(config.logChannel).send(`<@${message.member.id}> ran: ${message.content}`)
    }
}
