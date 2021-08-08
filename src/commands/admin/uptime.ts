import { Command } from "@beni69/cmd";
import ms from "ms";

export const command = new Command(
    { names: "uptime", description: "display the bot's uptime" },
    ({ trigger, client }) => {
        trigger.reply(`${ms(client.uptime!, { long: true })}`);
    }
);
