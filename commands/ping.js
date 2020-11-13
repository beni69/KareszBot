module.exports = {
    aliases: ['p'],
    run: (message, args, text, client, prefix, instance) => {
        message.channel.send(`🏓  ${Date.now()-message.createdTimestamp}ms`);
    }
}
