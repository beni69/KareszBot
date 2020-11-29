

// function Join(client, message, chan) {
//     const config = require('../../config.json');
//     const cmdlog = require('../../features/commandLog.js');
//
//     let vc;
//
//     if (!chan) {
//         if (!message.member.voice.channelID) {
//             message.channel.send('Join a voice channel first, dumbass');
//             return;
//         } else {
//             vc = message.member.voice.channel;
//             vc.join();
//         }
//     } else {
//         try {
//             vc = client.channels.cache.find(channel => channel.name == chan);
//             vc.join();
//         } catch (e) {
//             message.reply('Invalid channel name');
//             return;
//         } finally {}
//     }
//
//     cmdlog.Log(client, message, `<@${message.member.id}>: Joined **${vc.name}** in **${message.guild.name}**`);
// }
//
// exports.functionName = function () {
//     // body...
// };


let GetChan = function (client, message, chan){
    const config = require('../../config.json');
    const cmdlog = require('../../features/commandLog.js');

    let vc;

    if (!chan) {
        if (!message.member.voice.channelID) {
            message.channel.send('Join a voice channel first, dumbass');
            return 'failed';
        } else {
            vc = message.member.voice.channel;
            return vc;
        }
    } else {
        try {
            vc = client.channels.cache.find(channel => channel.name == chan);
            return vc;
        } catch (e) {
            message.reply('Invalid channel name');
            return 'failed';
        }
    }

    cmdlog.Log(client, message, `<@${message.member.id}>: Joined **${vc.name}** in **${message.guild.name}**`);
};
module.exports = GetChan;


module.exports = {
    aliases: [],
    minArgs: 0,
    maxArgs: -1,
    run: (message, args, text, client, prefix, instance) => {
        GetChan(client, message, text).join();
    }
};
