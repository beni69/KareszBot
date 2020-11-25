module.exports = {
    aliases: [],
    minArgs: 1,
    maxArgs: 1,
    run: (message, args, text, client, prefix, instance) => {
        const config = require('../../config.json');
        const cmdlog = require('../../features/commandLog.js');

        const target = message.mentions.users.first();
        const targetMember = message.guild.members.cache.get(target.id);

        if (target.id == config.owner.id) {

            message.channel.send("I'm sorry, you can't kill god");

        } else if (target.id == message.guild.ownerID) {

            message.channel.send("Sadly, you can't kick the server owner");

        } else if (target.bot) {

            for (var i = 0; i < targetMember._roles.length; i++) {
                const role = message.guild.roles.cache.find(role => role.id == targetMember._roles[i]);
                if (role.name != target.username) {
                    // console.log('name good');
                    targetMember.roles.remove(role);
                }
            }

            targetMember.kick();
        } else {

            for (var i = 0; i < targetMember._roles.length; i++) {
                const role = message.guild.roles.cache.find(role => role.id == targetMember._roles[i]);
                targetMember.roles.remove(role).catch(console.error);
            }

            try {
                targetMember.kick();
            } catch (e) {
                message.channel.send('There was an error')
            } finally {}
        }

        cmdlog.Log(client, message);
    }
};
