module.exports = {
    aliases: ["dl"],
    minArgs: 0,
    maxArgs: -1,
    run: ({message, args, text, client, prefix, instance}) => {
        const config = require("../../config.json");
        const cmdlog = require("../../features/commandLog.js");
        const ytdl = require("ytdl-core");
        const fs = require("fs");

        if (
            text.match(/(youtube.com|youtu.be)\/(watch)?(\?v=)?(\S+)?/) == false
        ) {
            message.channel.send("Invalid link");
            return;
        }

        if (!fs.existsSync("./temp")) {
            fs.mkdirSync("./temp");
        }

        const rand = Math.floor(Math.random() * 100);
        const file = fs.createWriteStream(`./temp/video-${rand}.mp4`);
        const ref = text;

        ytdl(ref, {quality: "highest"}).pipe(file);

        file.on("finish", () => {
            message.channel
                .send("", {files: [`./temp/video-${rand}.mp4`]})
                .catch(err => {
                    message.channel.send(
                        "There was an error. The video is probably too big"
                    );
                    console.error(err);
                });
        });
        cmdlog.Log(
            client,
            message,
            `<@${message.member.id}> in **${message.guild.name}**:    Downloading ${ref}`
        );
    },
};
