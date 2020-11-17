module.exports = {
    aliases: ['ccc'],
    minArgs: 0,
    maxArgs: -1,
    run: (message, args, text, client, prefix, instance) => {
        const config = require('../../config.json');
        // const amount = parseInt(args[0]) + 1
        const amount = 100
        let error;
        message.channel.bulkDelete(amount).catch(error)
        console.error(error);

        client.guilds.cache.get(config.testServer).channels.cache.get(config.logChannel).send(`<@${message.member.id}> ran: ${message.content}`)
    }
}
