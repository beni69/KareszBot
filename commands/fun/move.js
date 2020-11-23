module.exports = {
    aliases: [],
    minArgs: 1,
    maxArgs: -1,
    run: (message, args, text, client, prefix, instance) => {
        const config = require('../../config.json');
        const cmdlog = require('../../features/commandLog.js');

        if (args[0] == 'all' || args[0] == '@everyone') {

            let cName = text.replace(args[0], '');
            while (cName.charAt(0) == ' ') {
                cName = cName.substring(1);
            }

            const vc = client.channels.cache.find(channel => channel.name == cName);
            message.guild.members.cache.forEach(member => {
                //guard clause, early return
                if (!member.voice.channel) return;
                member.voice.setChannel(vc);
            });

        } else if (!message.mentions.users.size) {

            const vc = client.channels.cache.find(channel => channel.name == text);
            message.member.voice.setChannel(vc);

        } else {

            let cName = text.replace(args[0], '');
            while (cName.charAt(0) == ' ') {
                cName = cName.substring(1);
            }

            const vc = client.channels.cache.find(channel => channel.name == cName);
            const member = message.mentions.members.first();
            member.voice.setChannel(vc);
        }


        message.react('👌');

        cmdlog.Log(client, message);
    }
};
