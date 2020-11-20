module.exports = {
    aliases: ['profilepic', 'pfp', 'getpic'],
    minArgs: 0,
    maxArgs: 1,
    run: (message, args, text, client, prefix, instance) => {
        const config = require('../../config.json');
        const cmdlog = require('../../features/commandLog.js');
        if (!message.mentions.users.size) {
            message.channel.send(message.author.displayAvatarURL({
                format: "png",
                dynamic: true
            }));
        } else {
            const user = message.mentions.users.first();
            message.channel.send(user.displayAvatarURL({
                format: "png",
                dynamic: true
            }));
        }

        cmdlog.Log(client, message);
    }
};
