module.exports = {
    aliases: [],
    run: (message, args, text, client, prefix, instance) => {
        const config = require('../config.json');
        message.channel.send('Use this link to invite the bot to other servers:\nhttps://bit.ly/3ngmM5G');
        // message.channel.send('https://bit.ly/3ngmM5G');

        client.guilds.cache.get(config.testServer).channels.cache.get(config.logChannel).send(`<@${message.member.id}> ran: ${message.content}`)
    }
}
