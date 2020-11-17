module.exports = {
    aliases: [],
    run: (message, args, text, client, prefix, instance) => {
        message.channel.send('Use this link to invite the bot to other servers:\nhttps://bit.ly/3ngmM5G');
        // message.channel.send('https://bit.ly/3ngmM5G');

        const channel = message.guild.channels.cache.get(config.logChannel)
        channel.send(`<@${message.member.id}> ran: ${message.content}`)
    }
}
