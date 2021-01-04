module.exports = {
    aliases: ["info"],
    run: ({message, args, text, client, prefix, instance}) => {
        const config = require("../../config.json");
        const cmdlog = require("../../features/commandLog.js");
        const fetch = require("node-fetch");

        const url = "https://szlginfo.ptamas.hu/";

        const pfp = message.author.displayAvatarURL({
            format: "png",
            dynamic: true,
        });

        const emb1 = {
            color: "GREEN",
            title: "Success",
            author: {
                name: "Karesz",
                icon_url: config.karesz.pfp,
            },
            url: "https://szlginfo.ptamas.hu/",
            description: "`szlginfo.ptamas.hu` is up!",
            thumbnail: {
                url: "https://szlginfo.ptamas.hu/assets/img/f_logo.png",
            },

            timestamp: new Date(),
            footer: {
                text: message.author.tag,
                icon_url: pfp,
            },
        };

        const emb2 = {
            color: "RED",
            title: "sad moment 😔",
            author: {
                name: "Karesz",
                icon_url: config.karesz.pfp,
            },
            url: "https://szlginfo.ptamas.hu/",
            description: "`szlginfo.ptamas.hu` is down!",
            thumbnail: {
                url: "https://szlginfo.ptamas.hu/assets/img/f_logo.png",
            },

            timestamp: new Date(),
            footer: {
                text: message.author.tag,
                icon_url: pfp,
            },
        };

        message.channel.send({embed: check(url) ? emb1 : emb2});

        cmdlog.Log(client, message);

        async function check(url) {
            const res = await fetch(url);
            const up =
                res.status == 200 && res.statusText == "OK" ? true : false;
            return up;
        }
    },
};
