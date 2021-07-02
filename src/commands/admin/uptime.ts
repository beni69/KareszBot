import { Command } from "@beni69/cmd";
import { toTime } from "@beni69/cmd/dist/modules/Utils";

export const command = new Command(
    { names: "uptime", description: "display the bot's uptime" },
    ({ trigger, client }) => {
        trigger.reply(`${toTime(client.uptime!, true)}`);
    }
);
