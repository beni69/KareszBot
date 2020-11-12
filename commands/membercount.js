module.exports = {
    aliases: ['members'],
    run: (message, args) => {
        message.channel.send(`${guild.name} has ${guild.memberCount} members`);
    }
}
