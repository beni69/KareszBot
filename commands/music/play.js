module.exports = {
    aliases: ['p', 'youtube'],
    minArgs: 0,
    maxArgs: -1,
    run: (message, args, text, client, prefix, instance) => {
        const config = require('../../config.json');
        const cmdlog = require('../../features/commandLog.js');
        const ytdl = require('ytdl-core');

        if (text.match(/(youtube.com|youtu.be)\/(watch)?(\?v=)?(\S+)?/)) {

            Play(text);

        } else {

            message.channel.send("That's not a valid youtube link");
        }

        // cmdlog.Log(client, message);

        async function Play(song, chan) {

            // Joining
            let vc;
            if (!chan) {
                if (!message.member.voice.channelID) {
                    message.channel.send('Join a voice channel first, dumbass');
                    return;
                } else {
                    vc = message.member.voice.channel;
                }
            } else {
                try {
                    vc = client.channels.cache.find(channel => channel.name == chan);
                } catch (e) {
                    message.reply('Invalid channel name');
                    return;
                } finally {}
            }

            // playing
            await vc.join().then(connection => {
                const stream = ytdl(song, {
                    filter: 'audioonly'
                });
                const dispatcher = connection.play(stream);
            });

            // logging
            cmdlog.Log(client, message, `<@${message.member.id}>: playing <${song}> in **${vc.name}** in **${message.guild.name}**`);

        }

    }
};