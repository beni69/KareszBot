module.exports = {
    aliases: ['v', 'ver'],
    run: (message, args, text, client, prefix, instance) => {
        const config = require('../config.json');
        const Discord = require('discord.js');
        const helpEmbed2 = {
            title: 'Karesz',
            description: '**Command**\n*Usage*',
            thumbnail: {url: config.karesz.pfp},

            fields: [
                // {name: 'Command name', value: 'usage\n\n'},
                {name: 'Clear', value: 'clear <amount>'},
                {name: 'Poll', value: 'poll <message>'},
                {name: 'Kill', value: 'kill <@someone>'},
                {name: 'Profilepic', value: 'pfp <@someone>'}
            ],
            timestamp: new Date(),
            footer: {
                text: `${message.author.username}#${message.author.discriminator}`
            }
        }
        message.channel.send({embed: helpEmbed2})
    }
}
