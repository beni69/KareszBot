module.exports = {
    aliases: [],
    minArgs: 1,
    maxArgs: -1,
    run: (message, args, text, client, prefix, instance) => {
        const config = require('../../config.json');
        const cmdlog = require('../../features/commandLog.js');


        if (args.length == 1) {
            vc = client.channels.cache.find(channel => channel.name == args[0]);
            const member = message.guild.members.cache.get(message.author.id);
            member.voice.setChannel(vc);

        } else {
            vc = client.channels.cache.find(channel => channel.name == args[1]);
            const member = message.mentions.members.first();
            member.voice.setChannel(vc);
        }




        if (!message.mentions.users.size) {
            vc = client.channels.cache.find(channel => channel.name == text);
            const member = message.guild.members.cache.get(message.author.id);
            member.voice.setChannel(vc);
        } else {
            vc = client.channels.cache.find(channel => channel.name == text.replace(args[0], ''));
            const member = message.mentions.members.first();
            member.voice.setChannel(vc);
        }






        message.react('👌');

        cmdlog.Log(client, message);
    }
};
