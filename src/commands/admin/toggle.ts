import { Command } from "@beni69/cmd";

export const command = new Command(
    { names: "toggle", react: "👌" },
    ({ message, handler, logger }) => {
        console.log(handler.isPaused);

        if (handler.isPaused) {
            handler.pause = false;
            message.channel.send("Bot unpaused");
            logger?.log(message, ["$authorTag$", " unpaused the bot."]);
        } else {
            handler.pause = true;
            message.channel.send("Bot paused");
            logger?.log(message, ["$authorTag$", " paused the bot."]);
        }
    }
);
