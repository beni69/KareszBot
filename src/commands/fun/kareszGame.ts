import { Command } from "@beni69/cmd";
import {
    Client,
    EmojiIdentifierResolvable,
    GuildMember,
    Message,
    MessageEmbed,
} from "discord.js";
import config from "config";

export const command = new Command(
    { names: ["karesz", "kareszgame", "game"] },
    ({ message, prefix }) => {
        //
        let gameArgs;
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
--force - Ignore game board size limits *(not recommended)*`;

export class KareszGame {
    client: Client;
    message: Message;
    gameEmbed: MessageEmbed | null;
    opts: gameOptions;
    karesz: Array<coords>;
    kavicsok: Set<coords>;
    players: Array<GuildMember | null>;
    inGame: boolean;

    constructor(message: Message, args: gameOptions) {
        this.client = message.client;
        this.message = message;
        this.gameEmbed = null;
        this.opts = args;
        this.karesz = [
            { x: null, y: null },
            { x: null, y: null },
        ];
        this.kavicsok = new Set();
        this.players = [message.member, null];
        this.inGame = false;
        // this.kareszEmoji = config.get("emojis.karesz");
    }

    toString() {
        let str = "";
        for (let y = 0; y < this.opts.height; y++) {
            for (let x = 0; x < this.opts.width; x++) {
                if (this.karesz.includes({ x, y }))
                    str += `${this.opts.karesz}`;
                else if (this.kavicsok.has({ x, y })) str += this.opts.kavics;
                else str += this.opts.bg;
            }
            str += "\n";
        }
        return str;
    }

    // TODO: literally everything else:
    // https://github.com/beni69/Karesz/blob/main/commands/fun/game.js
    // https://github.com/beni69/Karesz/blob/main/features/KareszGame.js
}

export interface coords {
    x: number | null;
    y: number | null;
}

export interface gameOptions {
    width: number;
    height: number;
    bg: string;
    kavics: string;
    karesz: EmojiIdentifierResolvable;
}
