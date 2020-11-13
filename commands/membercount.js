module.exports = {
    aliases: ['members'],
    run: (message, args, text, client, prefix, instance) => {
        // client.guilds.cache.forEach((guild) => {
        //     message.channel.send(`${guild.name} has ${guild.memberCount} members`);
        // });

        message.channel.send(`${message.guild.name} has ${message.guild.memberCount} members`);
    }
}
