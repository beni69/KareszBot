const Discord = require("discord.js");

const WIDTH = 15;
const HEIGHT = 10;
// const gameBoard = [];
let kareszEmoji;

class KareszGame {
    constructor(client) {
        this.karesz = {x: 5, y: 5};
        this.gameEmbed = null;
        this.inGame = false;
        this.kavicsok = [];
        this.client = client;

        // kareszEmoji = this.client.emojis.cache.get("789941051229077554");

        // for (let y = 0; y < HEIGHT; y++) {
        //     for (let x = 0; WIDTH; x++) {
        //         gameBoard[y * WIDTH + x] = "⬜";
        //     }
        // }
    }

    toString() {
        let str = "";
        for (let y = 0; y < HEIGHT; y++) {
            for (let x = 0; x < WIDTH; x++) {
                if (this.karesz.x == x && this.karesz.y == y) {
                    str += `${kareszEmoji}`;
                    // str += "🟦";
                } else if (
                    this.kavicsok.some(item => item.x == x && item.y == y)
                ) {
                    str += "⬛";
                } else {
                    /* str += gameBoard[y * WIDTH + x]; */ str += "⬜";
                }
            }
            str += "\n";
        }
        return str;
    }

    newGame(message) {
        this.inGame = true;
        kareszEmoji = this.client.emojis.cache.get("789941051229077554");
        this.lerak(13, 5);
        const embed = new Discord.MessageEmbed()
            .setColor("BLURPLE")
            .setTitle(`Karesz Game ${kareszEmoji}`)
            .setDescription(this.toString())
            .setTimestamp();

        message.channel.send(embed).then(emsg => {
            this.gameEmbed = emsg;
            this.gameEmbed.react("⬅️");
            this.gameEmbed.react("⬆️");
            this.gameEmbed.react("⬇️");
            this.gameEmbed.react("➡️");
            this.gameEmbed.react("🔳");
            this.gameEmbed.react("🛑");
        });
    }

    // waitForInput() {
    //     this.gameEmbed.awaitReactions((reaction, user) => {});
    // }

    // filter(reaction, user) {}

    down(x, y) {
        this.kavicsok.push(new Kavics(x, y));
    }

    up(x, y) {}
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
