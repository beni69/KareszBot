module.exports = {
    aliases: ['members'],
    run: (message, args) => {
        client.guilds.cache.forEach((guild) => {
            message.channel.send(`${guild.name} has ${guild.memberCount} members`);
        });


    }
}
