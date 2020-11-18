module.exports = {
    aliases: [],
    run: (message, args, text, client, prefix, instance) => {
        const config = require('../config.json');
        message.channel.send(`🏓  ${Date.now()-message.createdTimestamp}ms`);

        client.guilds.cache.get(config.testServer).channels.cache.get(config.logChannel).send(`<@${message.member.id}> ran: ${message.content}`)
    }
}
