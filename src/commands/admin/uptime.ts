import { Command } from "@beni69/cmd";
import { toTime } from "@beni69/cmd/dist/modules/Utils";

export const command = new Command(
    { names: "uptime" },
    ({ message, client }) => {
        message.channel.send(`${toTime(client.uptime!, true)}`);
    }
);
