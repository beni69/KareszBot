module.exports = {
    aliases: [],
    run: (message, args, text, client, prefix, instance) => {
        const config = require('../../config.json');
        // const pog = message.guild.emojis.cache.find(emoji => emoji.name === 'pog');
        // message.react(pog);
        message.channel.send('https://cdn.discordapp.com/emojis/718439375792242738.png?v=1');

        client.guilds.cache.get(config.testServer).channels.cache.get(config.logChannel).send(`<@${message.member.id}> ran: ${message.content}`)
    }
}
