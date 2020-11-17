module.exports = {
    aliases: ['c', 'cc'],
    minArgs: 1,
    maxArgs: 1,
    run: (message, args, text, client, prefix, instance) => {
        const config = require('../config.json');
        const amount = parseInt(args[0]) + 1
        message.channel.bulkDelete(amount)

        client.guilds.cache.get(config.testServer).channels.cache.get(config.logChannel).send(`<@${message.member.id}> ran: ${message.content}`)
    }
}
