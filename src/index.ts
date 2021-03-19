import { Handler } from "@beni69/cmd";
import { Client, Message } from "discord.js";
import dotenv from "dotenv";
import { connectDB } from "./Mongoose";

dotenv.config();
console.clear();
const client = new Client();
let handler: Handler;
connectDB(process.env.MONGODB as string);

client.on("ready", () => {
    handler = new Handler({
        client,
        prefix: (process.env.BOT_PREFIX as string) || "!",
        commandsDir: "./commands",
        admins: ["376793727794020354"],
        testServers: ["437232118771482645"],
        triggers: [
            ["karesz", "789941051229077554"],
            ["bruh", "🗿"],
        ],
        blacklist: ["780366371083124746", "785239652754915350"],
        helpCommand: { names: "help" },
        logging: {
            channel: "778203356765487134",
            format: [
                "$authorTag$",
                " in ",
                "$channelTag$",
                ":\t",
                "*$content$*",
            ],
        },
        mongodb: process.env.MONGODB as string,
        pauseCommand: "toggle",
        verbose: true,
    });

    console.log(`Bot ready: ${client.user?.tag}`);

    handler.getLogger?.send("Bot ready!");
});

client.on("guildMemberAdd", member => {
    // TODO: auto-res user
});

client.login(process.env.BOT_TOKEN);

process.on("unhandledRejection", err => {
    console.error("Unhandled promise rejection:", err);
    handler.getLogger?.send(
        `Unhandled promise rejection:\n` + "```" + err + "```"
    );
});
