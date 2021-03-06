import { Command } from "../cmd";
export const command = new Command(
    { names: ["ping", "p"] },
    ({ message, prefix }) => {
        message.channel.send(
            `${prefix} 🏓 ${Date.now() - message.createdTimestamp}ms`
        );
    }
);
