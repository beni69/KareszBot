module.exports = {
    aliases: ['members'],
    run: (message, args, text, client, prefix, instance) => {
        message.channel.send(`${message.guild.name} has ${message.guild.memberCount} members`);
    }
}
