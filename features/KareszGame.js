const Discord = require("discord.js");
const config = require("../config.json");

let kareszEmoji;

class KareszGame {
    constructor(client, message, args) {
        this.karesz = {x: null, y: null};
        this.karesz2 = {x: null, y: null};
        this.gameEmbed = null;
        this.inGame = false;
        this.kavicsok = [];
        this.client = client;
        this.message = message;
        this.p1 = message.member;
        this.p2 = args.p2 || null;
        this.args = args;
        this.WIDTH = args.WIDTH;
        this.HEIGHT = args.HEIGHT;

        kareszEmoji = this.client.emojis.cache.get(config.emoji.karesz);
    }

    toString() {
        let str = "";
        for (let y = 0; y < this.HEIGHT; y++) {
            for (let x = 0; x < this.WIDTH; x++) {
                if (this.karesz2.x == x && this.karesz2.y == y) {
                    str += `${kareszEmoji}`;
                } else if (this.karesz.x == x && this.karesz.y == y) {
                    str += `${kareszEmoji}`;
                } else if (
                    this.kavicsok.some(item => item.x == x && item.y == y)
                ) {
                    str += "⬛";
                } else {
                    str += "⬜";
                }
            }
            str += "\n";
        }
        return str;
    }

    newGame() {
        this.inGame = true;
        this.karesz = {
            x: Math.floor(this.WIDTH / 2),
            y: Math.floor(this.HEIGHT / 2),
        };
        if (this.args.p2) this.karesz2 = {x: 0, y: 0};
        const embed = new Discord.MessageEmbed()
            .setColor("BLURPLE")
            .setTitle(`Karesz Game ${kareszEmoji}`)
            .setDescription(this.toString())
            .setTimestamp();

        this.message.channel.send(embed).then(emsg => {
            this.gameEmbed = emsg;
            this.gameEmbed.react("⬅️");
            this.gameEmbed.react("⬆️");
            this.gameEmbed.react("⬇️");
            this.gameEmbed.react("➡️");
            this.gameEmbed.react("🔳");
            this.gameEmbed.react("🔲");
            this.gameEmbed.react("🛑");

            this.waitForInput();
        });
    }

    waitForInput() {
        this.gameEmbed
            .awaitReactions((reaction, user) => this.filter(reaction, user), {
                max: 1,
                time: 60000,
                errors: ["time"],
            })
            .then(collected => {
                const r = collected.first();
                const user = r.users.cache
                    .filter(user => user.id != this.gameEmbed.author.id)
                    .first();

                switch (r.emoji.name) {
                    case "⬅️":
                        if (this.p2 && user.id == this.p2.id)
                            this.step(this.karesz2.x - 1, this.karesz2.y);
                        else this.step(this.karesz.x - 1, this.karesz.y);
                        break;

                    case "⬆️":
                        if (this.p2 && user.id == this.p2.id)
                            this.step(this.karesz2.x, this.karesz2.y - 1);
                        else this.step(this.karesz.x, this.karesz.y - 1);
                        break;

                    case "⬇️":
                        if (this.p2 && user.id == this.p2.id)
                            this.step(this.karesz2.x, this.karesz2.y + 1);
                        else this.step(this.karesz.x, this.karesz.y + 1);
                        break;

                    case "➡️":
                        if (this.p2 && user.id == this.p2.id)
                            this.step(this.karesz2.x + 1, this.karesz2.y);
                        else this.step(this.karesz.x + 1, this.karesz.y);
                        break;

                    case "🔳":
                        if (this.p2 && user.id == this.p2.id)
                            this.down(this.karesz2.x, this.karesz2.y);
                        else this.down(this.karesz.x, this.karesz.y);
                        break;

                    case "🔲":
                        if (this.p2 && user.id == this.p2.id)
                            this.up(this.karesz2.x, this.karesz2.y);
                        else this.up(this.karesz.x, this.karesz.y);
                        break;

                    case "🛑":
                        this.gameOver();
                        break;

                    default:
                        console.log("Unknown reaction");
                        this.waitForInput();
                        break;
                }
                r.users.remove(user);
            })
            .catch(() => {
                this.gameOver();
            });
    }

    filter(reaction, user) {
        let u;
        if (this.args.p2) u = user.id == this.p1.id || user.id == this.p2.id;
        else if (this.args.coop) u = user.id != this.gameEmbed.author.id;
        else u = user.id == this.p1.id;
        return (
            ["⬅️", "⬆️", "⬇️", "➡️", "🔳", "🔲", "🛑"].includes(
                reaction.emoji.name
            ) && u
        );
    }

    step(x, y) {
        if (!(x < 0 || y < 0 || x > this.WIDTH - 1 || y > this.HEIGHT - 1)) {
            this.karesz.x = x;
            this.karesz.y = y;

            const edited = new Discord.MessageEmbed()
                .setColor("BLURPLE")
                .setTitle(`Karesz Game ${kareszEmoji}`)
                .setDescription(this.toString())
                .setTimestamp();
            this.gameEmbed.edit(edited);
        }
        this.waitForInput();
    }

    down(x, y) {
        this.kavicsok.push({x: x, y: y});
        this.step(this.karesz.x, this.karesz.y);
    }

    up(x, y) {
        for (let i = 0; i < this.kavicsok.length; i++) {
            const item = this.kavicsok[i];
            if (item.x == x && item.y == y) {
                this.kavicsok.splice(i, 1);
                break;
            }
        }
        this.step(this.karesz.x, this.karesz.y);
    }

    gameOver() {
        this.inGame = false;
        const edited = new Discord.MessageEmbed()
            .setColor("GREEN")
            .setTitle(`Thanks for playing! ${kareszEmoji}`)
            .setDescription(this.toString())
            .setTimestamp();
        this.gameEmbed.edit(edited);
        this.gameEmbed.reactions.removeAll();
    }
}

module.exports = KareszGame;
// const game = new KareszGame();
