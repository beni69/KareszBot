module.exports = {
    aliases: [],
    minArgs: 1,
    maxArgs: 1,
    run: (message, args, text, client, prefix, instance) => {
        const config = require('./config.json');
        const target = message.mentions.users.first()
        const targetMember = message.guild.members.cache.get(target.id)
        if (target.id == config.owner.id) {

            message.channel.send("I'm sorry, you can't kill god")

        } else {
            if (targetMember.roles.cache.some(role => role.name === 'Admin')) {

                const adminRole = message.guild.roles.cache.find(role => role.name === 'Admin')
                targetMember.roles.remove(adminRole)
                // console.log('admin role removed');

            }
            if (targetMember.roles.cache.some(role => role.name === 'Bot')) {

                const botRole = message.guild.roles.cache.find(role => role.name === 'Bot')
                targetMember.roles.remove(botRole)
                // console.log('bot role removed');
            }
            console.log(targetMember);
            targetMember.kick()
            message.channel.send(`${targetMember.user.username} fell off a cliff`)
        }
    }
}
