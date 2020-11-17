module.exports = {
    aliases: [],
    run: (message, args, text, client, prefix, instance) => {
        // const pog = message.guild.emojis.cache.find(emoji => emoji.name === 'pog');
        // message.react(pog);
        message.channel.send('https://cdn.discordapp.com/emojis/718439375792242738.png?v=1');

        const channel = message.guild.channels.cache.get(config.logChannel)
        channel.send(`<@${message.member.id}> ran: ${message.content}`)
    }
}
