import Discord from "discord.js";
import dotenv from "dotenv";
// @ts-ignore
import * as cmd from "@beni69/cmd";

dotenv.config();

const client = new Discord.Client();

client.on("ready", () => {
    console.log(`Bot ready: ${client.user?.tag}`);

    const handler = new cmd.Handler({
        client,
        prefix: (process.env.BOT_PREFIX as string) || "!",
        commandsDir: "./commands",
        admins: ["376793727794020354"],
        testServers: ["437232118771482645"],
        triggers: [
            ["karesz", "789941051229077554"],
            ["bruh", "🗿"],
        ],
    });
});

client.login(process.env.BOT_TOKEN);
