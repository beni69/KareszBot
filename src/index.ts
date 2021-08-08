import { Handler } from "@beni69/cmd";
import { Client } from "discord.js";
import dotenv from "dotenv";
import { getRoles } from "./commands/moderation";
import { connectDB } from "./Mongoose";

dotenv.config();
console.clear();

const PROD = process.env.NODE_ENV === "production";

const client = new Client({
    intents: [
        "GUILDS",
        "GUILD_MESSAGES",
        "DIRECT_MESSAGES",
        "GUILD_INTEGRATIONS",
    ],
});
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
        blacklist: ["780366371083124746"],
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
        testMode: !PROD,
        verbose: true,
    });

    console.log(`Bot ready: ${client.user?.tag}`);

    handler.getLogger?.send("Bot ready!");
});

client.on("guildMemberAdd", async member => {
    const roles = await getRoles(member);
    console.log({ roles });
    if (roles) member.roles.add(roles.roles);
    // test server
    else if (member.guild.id == "437232118771482645")
        member.roles.add("745651494027657247");
});

client.login(process.env.BOT_TOKEN);

process.on("unhandledRejection", err => {
    console.error("Unhandled promise rejection:", err);
    handler.getLogger?.send(
        `Unhandled promise rejection:\n` + "```" + err + "```"
    );
});
