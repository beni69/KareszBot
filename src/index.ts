import Discord from "discord.js";
import dotenv from "dotenv";
import * as cmd from "./modules/cmd";

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

client.on("message", message => {
    // console.log({ raw: message.content });
});

client.login(process.env.BOT_TOKEN);
