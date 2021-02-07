const config = require("../../config.json");
const cmdlog = require("../../features/commandLog.js");
let GetChan = function (client, message, chan) {
    let vc;

    if (!chan) {
        if (!message.member.voice.channelID) {
            message.channel.send("Join a voice channel first, dumbass");
            return "failed";
        } else {
            vc = message.member.voice.channel;
            return vc;
        }
    } else {
        try {
            vc = client.channels.cache.find(channel => channel.name == chan);
            return vc;
        } catch (e) {
            message.reply("Invalid channel name");
            return "failed";
        }
    }
};
module.exports = GetChan;

module.exports = {
    aliases: ["j"],
    minArgs: 0,
    maxArgs: -1,
    run: ({message, args, text, client, prefix, instance}) => {
        GetChan(client, message, text).join();
        cmdlog.Log(
            client,
            message,
            `<@${message.member.id}>: Joined **${vc.name}** in **${message.guild.name}**`
        );
    },
};
