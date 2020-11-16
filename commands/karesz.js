module.exports = {
    aliases: [],
    run: (message, args, text, client, prefix, instance) => {
        const karesz = message.guild.emojis.cache.find(emoji => emoji.name === 'karesz');
        message.react(karesz);
        message.channel.send('https://cdn.discordapp.com/emojis/776413600117030913.png?v=1')
    }
}
