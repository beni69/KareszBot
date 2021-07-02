import { Command } from "@beni69/cmd";
import decodeGif from "decode-gif";
import { readFileSync } from "fs";
import { ascii, code } from ".";

let running = false;

export const command = new Command(
    {
        names: ["amogus", "amongus", "sus", "ඞ"],
        description: "suspicious",
    },
    async ({ trigger }) => {
        if (running) {
            trigger.reply({
                content:
                    "Already running. Wait a couple of seconds and try again.",
                ephemeral: true,
            });
            return false;
        }
        running = true;
        const gif = decodeGif(readFileSync("img/sus.gif"));
        const asciiFrames = await ascii(gif);

        await trigger.reply("get stick bugged lol");
        const msg = await trigger.fetchReply();
        if (!msg) return false;
        for (let i = 0; i < 5; i++) {
            for (const frame of asciiFrames) {
                await msg.edit(code(frame));
                await new Promise(r => setTimeout(r, 1000));
            }
        }

        running = false;
    }
);
