import { Handler } from "@beni69/cmd";
import { Client } from "discord.js";
import dotenv from "dotenv";
import { connectDB } from "./Mongoose";

dotenv.config();
console.clear();
const client = new Client();
connectDB(process.env.MONGODB as string);

client.on("ready", () => {
    console.log(`Bot ready: ${client.user?.tag}`);

    const handler = new Handler({
        client,
        prefix: (process.env.BOT_PREFIX as string) || "!",
        commandsDir: "./commands",
        admins: ["376793727794020354"],
        testServers: ["437232118771482645"],
        triggers: [
            ["karesz", "789941051229077554"],
            ["bruh", "🗿"],
        ],
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
        verbose: false,
    });

    handler.getLogger?.send("Bot ready!");
});

client.login(process.env.BOT_TOKEN);
