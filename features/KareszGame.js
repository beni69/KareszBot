const Discord = require("discord.js");

let kareszEmoji;

class KareszGame {
    constructor(client, message, args) {
        this.karesz = {x: 5, y: 5};
        this.gameEmbed = null;
        this.inGame = false;
        this.kavicsok = [];
        this.client = client;
        this.message = message;
        this.args = args;

        this.WIDTH = args.WIDTH;
        this.HEIGHT = args.HEIGHT;
    }

    toString() {
        let str = "";
        for (let y = 0; y < this.HEIGHT; y++) {
            for (let x = 0; x < this.WIDTH; x++) {
                if (this.karesz.x == x && this.karesz.y == y) {
                    str += `${kareszEmoji}`;
                    // str += "🟦";
                } else if (
                    this.kavicsok.some(item => item.x == x && item.y == y)
                ) {
                    str += "⬛";
                } else {
                    /* str += gameBoard[y * this.WIDTH + x]; */ str += "⬜";
                }
            }
            str += "\n";
        }
        return str;
    }

    newGame() {
        this.inGame = true;
        this.karesz.x = Math.floor(this.WIDTH / 2);
        this.karesz.y = Math.floor(this.HEIGHT / 2);
        kareszEmoji = this.client.emojis.cache.get("789941051229077554");
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
                        // console.log("Left arrow");
                        this.step(this.karesz.x - 1, this.karesz.y);
                        break;
                    case "⬆️":
                        // console.log("Up arrow");
                        this.step(this.karesz.x, this.karesz.y - 1);
                        break;
                    case "⬇️":
                        // console.log("Down arrow");
                        this.step(this.karesz.x, this.karesz.y + 1);
                        break;
                    case "➡️":
                        // console.log("Right arrow");
                        this.step(this.karesz.x + 1, this.karesz.y);
                        break;
                    case "🔳":
                        this.down(this.karesz.x, this.karesz.y);
                        break;
                    case "🔲":
                        this.up(this.karesz.x, this.karesz.y);
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
        return (
            ["⬅️", "⬆️", "⬇️", "➡️", "🔳", "🔲", "🛑"].includes(
                reaction.emoji.name
            ) &&
            (this.args.coop
                ? user.id != this.gameEmbed.author.id
                : user.id == this.message.author.id)
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
        // this.kavicsok.push(new Kavics(x, y));
        this.kavicsok.push({x: x, y: y});
        this.step(this.karesz.x, this.karesz.y);
    }

    up(x, y) {
        for (let i = 0; i < this.kavicsok.length; i++) {
            const item = this.kavicsok[i];
            if (item.x == x && item.y && y) {
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

class Kavics {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

module.exports = KareszGame;
module.exports.Kavics = Kavics;
// const game = new KareszGame();
