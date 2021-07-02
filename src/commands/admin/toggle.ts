import { Command } from "@beni69/cmd";

export const command = new Command(
    { names: "toggle", description: "pause the command handler", react: "👌" },
    ({ trigger, handler, logger }) => {
        console.log(handler.isPaused);

        if (handler.isPaused) {
            handler.pause = false;
            trigger.reply("Bot unpaused");
            logger?.log(trigger, ["$authorTag$", " unpaused the bot."]);
        } else {
            handler.pause = true;
            trigger.reply("Bot paused");
            logger?.log(trigger, ["$authorTag$", " paused the bot."]);
        }
    }
);
