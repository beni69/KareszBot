module.exports = {
    aliases: ['dl'],
    minArgs: 0,
    maxArgs: -1,
    run: (message, args, text, client, prefix, instance) => {
        const config = require('../../config.json');
        const cmdlog = require('../../features/commandLog.js');
        const ytdl = require('ytdl-core');
        const fs = require('fs');

        if (text.match(/(youtube.com|youtu.be)\/(watch)?(\?v=)?(\S+)?/) == false) {
            message.channel.send('Invalid link');
            return;
        }

        if (!fs.existsSync('./temp')) {
            fs.mkdirSync('./temp');
        }

        const file = fs.createWriteStream('./temp/video.mp4');
        ytdl(text)
            .pipe(file);

        file.on('finish', () => {
            message.channel.send('a', { files: ['./temp/video.mp4'] });

        });

        cmdlog.Log(client, message);
    }
};
