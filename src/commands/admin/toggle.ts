import { Command } from "@beni69/cmd";

export const command = new Command(
    { names: "pause", react: "👌" },
    ({ message, handler }) => {
        if (handler.isPaused) {
            handler.pause = false;
            message.channel.send("Bot unpaused");
        } else {
            handler.pause = true;
            message.channel.send("Bot paused");
        }
    }
);
