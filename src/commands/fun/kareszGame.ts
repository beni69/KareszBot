import { Command, Trigger } from "@beni69/cmd";
import config from "config";
import {
    Client,
    EmojiResolvable,
    GuildEmoji,
    GuildMember,
    Message,
    MessageEmbed,
    MessageReaction,
    Snowflake,
    User,
} from "discord.js";

export const command = new Command(
    {
        names: ["karesz", "kareszgame", "game"],
        description: "play the famous karesz game right here in discord",
        argvAliases: { width: ["W"], height: ["H"], coop: ["c"] },
        options: [
            {
                name: "coop",
                description:
                    "allow anyone to control your karesz. NOTE: this is mutually exclusive with the player option",
                type: "BOOLEAN",
                required: false,
            },
            {
                name: "player",
                description: "define a second player you'd like to play with",
                type: "USER",
                required: false,
            },
        ],
    },
    async ({ trigger, prefix, argv }) => {
        if (argv.get("help")) {
            trigger.reply(help(prefix));
            return false;
        }

        const _y = argv.get("_yargs");

        let gameOpts: gameOptions = {
            width: (argv.get("width") || 15) as number,
            height: (argv.get("height") || 10) as number,
            karesz: config.get("emojis.karesz") as Snowflake,
            bg: "⬜",
            kavics: "⬛",
            coop: !!argv.get("coop") || false,
            players: [],
        };

        let p = argv.get("player");
        if (p) {
            p = await trigger.guild?.members.fetch(p as Snowflake);
            console.log({ p });
            gameOpts.players = [p as GuildMember];
        }

        const game = new KareszGame(trigger, gameOpts);
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
    trigger: Trigger;
    gameEmbed: Message | null;
    opts: gameOptions;
    karesz: Array<karesz>;
    kavicsok: Array<[number, number]>;
    players: Array<GuildMember>;
    inGame: boolean;

    constructor(trigger: Trigger, opts: gameOptions) {
        this.client = trigger.client;
        this.trigger = trigger;
        this.gameEmbed = null;
        this.opts = opts;
        this.opts.karesz = trigger.client.emojis.resolve(
            opts.karesz
        ) as GuildEmoji;
        this.karesz = [{ x: null, y: null }];
        this.kavicsok = [];
        this.players = [trigger.member as GuildMember, ...opts.players];
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

    async newGame() {
        this.inGame = true;
        this.karesz[0] = {
            x: Math.ceil(this.opts.width / 2),
            y: Math.ceil(this.opts.height / 2),
        };
        if (this.players[1]) this.karesz[1] = { x: 1, y: 1 };

        const emb = this.render("new")!;

        this.trigger.reply({ embeds: [emb] });
        const msg = await this.trigger.fetchReply();
        if (!msg) return;
        msg.react("⬅️");
        msg.react("⬆️");
        msg.react("⬇️");
        msg.react("➡️");
        msg.react("🔳");
        msg.react("🔲");
        msg.react("🛑");

        this.gameEmbed = msg;
        this.waitForInput();

        return this;
    }

    private waitForInput() {
        this.gameEmbed
            // .awaitReactions((r, u) => this.filter(r, u), {
            //     max: 1,
            //     time: 60000,
            //     errors: ["time"],
            // })
            ?.awaitReactions({
                filter: (r, u) => this.filter(r, u),
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
    private filter(reaction: MessageReaction, user: User): boolean {
        const emojiRule = ["⬅️", "⬆️", "⬇️", "➡️", "🔳", "🔲", "🛑"].includes(
            reaction.emoji.name as string
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

        this.gameEmbed?.edit({ embeds: [emb] });

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
    karesz: EmojiResolvable;
    coop: boolean;
    players: Array<GuildMember>;
}
