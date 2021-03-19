import { Command } from "@beni69/cmd";
import config from "config";
import {
    Client,
    EmojiIdentifierResolvable,
    GuildMember,
    Message,
    MessageEmbed,
    MessageReaction,
    User,
} from "discord.js";

export const command = new Command(
    { names: ["karesz", "kareszgame", "game"] },
    async ({ message, prefix, argv }) => {
        if (argv.h || argv.help) return message.channel.send(help(prefix));

        let gameOpts: gameOptions = {
            width: (argv.W || argv.width || 15) as number,
            height: (argv.H || argv.height || 10) as number,
            karesz: (argv.karesz || config.get("emojis.karesz")) as string,
            bg: (argv.bg || argv.background || "⬜") as string,
            kavics: (argv.kavics || "⬛") as string,
            coop: (argv.c || argv.coop || false) as boolean,
            players: [],
        };

        let p = argv.p || argv.player;
        if (p) {
            p = await message.guild?.members.fetch(p as string);
            console.log({ p });
            gameOpts.players = [p as GuildMember];
        }

        const game = new KareszGame(message, gameOpts);
        game.newGame();
    }
);

export const help = (prefix: string) => `
**Usage:**
${prefix}game *[options]*

**Options:**
-h - Help menu
-c
--coop - Bot won't ignore reactions from other players *(default: off)*
-W *[width]*
--width *[width]* - Set game board width, maximum is 15 *(default: 15)*
-H *[height]*
--height *[height]* - Set game board height, maximum is 10 *(default: 10)*
-f
--force - Ignore game board size limits *(not recommended)*
`;

export class KareszGame {
    client: Client;
    message: Message;
    gameEmbed: Message | null;
    opts: gameOptions;
    karesz: Array<karesz>;
    kavicsok: Array<[number, number]>;
    players: Array<GuildMember>;
    inGame: boolean;

    constructor(message: Message, opts: gameOptions) {
        this.client = message.client;
        this.message = message;
        this.gameEmbed = null;
        this.opts = opts;
        this.opts.karesz = message.client.emojis.resolve(opts.karesz)!;
        this.karesz = [{ x: null, y: null }];
        this.kavicsok = [];
        this.players = [message.member as GuildMember, ...opts.players];
        this.inGame = false;
    }

    toString() {
        let str = "";
        for (let y = 1; y < this.opts.height; y++) {
            for (let x = 1; x < this.opts.width; x++) {
                if (this.karesz.find(k => k.x === x && k.y === y))
                    str += this.opts.karesz.toString();
                else if (this.kavicsok.some(k => k[0] === x && k[1] === y))
                    str += this.opts.kavics;
                else str += this.opts.bg;
            }
            str += "\n";
        }
        return str;
    }

    newGame() {
        this.inGame = true;
        this.karesz[0] = {
            x: Math.ceil(this.opts.width / 2),
            y: Math.ceil(this.opts.height / 2),
        };
        if (this.players[1]) this.karesz[1] = { x: 1, y: 1 };

        const emb = this.render("new")!;

        this.message.channel.send(emb).then(msg => {
            msg.react("⬅️");
            msg.react("⬆️");
            msg.react("⬇️");
            msg.react("➡️");
            msg.react("🔳");
            msg.react("🔲");
            msg.react("🛑");

            this.gameEmbed = msg;
            this.waitForInput();
        });

        return this;
    }

    private waitForInput() {
        this.gameEmbed
            ?.awaitReactions((r, u) => this.filter(r, u), {
                max: 1,
                time: 60000,
                errors: ["time"],
            })
            .then(collected => {
                // get the reaction and the user
                const r = collected.first();
                const user: User = r?.users.cache
                    .filter(user => user.id != this.gameEmbed?.author.id)
                    .first()!;
                const p = this.players.findIndex(u => u.id === user.id);

                // do whatever the user wants to
                switch (r?.emoji.name) {
                    // movement
                    case "⬅️":
                        this.step(-1, 0, p);
                        break;
                    case "⬆️":
                        this.step(0, -1, p);
                        break;
                    case "⬇️":
                        this.step(0, 1, p);
                        break;
                    case "➡️":
                        this.step(1, 0, p);
                        break;

                    // kavicsok
                    case "🔳":
                        this.lerak(p);
                        break;
                    case "🔲":
                        this.felvesz(p);
                        break;

                    case "🛑":
                        this.gameOver();
                }

                // remove user's reaction
                r?.users.remove(user);
            })
            // stop the game after the timeout
            .catch(() => this.gameOver());
    }

    // filter for the reaction collector
    private filter(reaction: MessageReaction, user: GuildMember): boolean {
        const emojiRule = ["⬅️", "⬆️", "⬇️", "➡️", "🔳", "🔲", "🛑"].includes(
            reaction.emoji.name
        );
        let userRule;

        if (this.players[1])
            userRule = this.players.some(item => item?.id === user.id);
        else if (this.opts.coop)
            userRule = user.id !== this.gameEmbed?.author.id;
        else userRule = user.id === this.players[0]?.id;
        return emojiRule && userRule;
    }

    step(xOffset: number, yOffset: number, p = 0) {
        const x = this.karesz[p].x! + xOffset;
        const y = this.karesz[p].y! + yOffset;

        if (x < 1 || y < 1 || x > this.opts.width || y > this.opts.height)
            return this.waitForInput();

        this.karesz[p] = { x, y };

        this.render();
    }

    lerak(p: number) {
        const { x, y } = this.karesz[p];
        this.kavicsok.push([x as number, y as number]);
        this.render();
    }
    felvesz(p: number) {
        const { x, y } = this.karesz[p];
        this.kavicsok.splice(
            this.kavicsok.findIndex(k => k[0] === x && k[1] === y),
            1
        );
        this.render();
    }

    private render(task: "new" | "edit" | "rip" = "edit") {
        const emb = new MessageEmbed()
            .setDescription(this.toString())
            .setTimestamp();
        // create the end screen
        if (task === "rip")
            emb.setColor("GREEN").setTitle(
                `Thanks for playing! ${this.opts.karesz}`
            );
        // render the board
        else if (task === "new" || task === "edit")
            emb.setColor("BLURPLE").setTitle(`Karesz Game ${this.opts.karesz}`);

        if (task === "new") return emb;

        this.gameEmbed?.edit(emb);

        if (task !== "rip") this.waitForInput();
    }

    gameOver() {
        this.inGame = false;
        this.render("rip");
        this.gameEmbed?.reactions.removeAll();
    }
}

export interface karesz {
    x: number | null;
    y: number | null;
}

export interface gameOptions {
    width: number;
    height: number;
    bg: string;
    kavics: string;
    karesz: EmojiIdentifierResolvable;
    coop: boolean;
    players: Array<GuildMember>;
}
