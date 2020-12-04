module.exports = {
    aliases: ['p', 'youtube'],
    minArgs: 0,
    maxArgs: -1,
    run: (message, args, text, client, prefix, instance) => {
        const config = require('../../config.json');
        const cmdlog = require('../../features/commandLog.js');
        const ytdl = require('ytdl-core');

        let song = text;

        if (text.match(/(youtube.com|youtu.be)\/(watch)?(\?v=)?(\S+)?/)) {

            Play(song);

        } else {

            message.channel.send("That's not a valid youtube link");
        }

        // cmdlog.Log(client, message);

        async function Play(song) {

            // Joining
            let vc;
            if (!message.guild.voice.connection) {

                if (!message.member.voice.channelID) {
                    message.channel.send('Join a voice channel first, dumbass');
                    return;
                } else vc = message.member.voice.channel;
            } else vc = message.guild.voice.channel;

            try {

                // playing
                await vc.join().then(connection => {
                    const stream = ytdl(song, {
                        filter: 'audioonly'
                    });
                    const dispatcher = connection.play(stream);

                    if (text.toLowerCase().includes(' -l')) dispatcher.on('finish', () => Play(song));
                });

            } catch (e) {
                message.channel.send('Invalid link');
                console.error(e);
            } finally {

                // logging
                cmdlog.Log(client, message, `<@${message.member.id}>: playing <${song}> in **${vc.name}** in **${message.guild.name}**`);
            }


        }

    }
};
