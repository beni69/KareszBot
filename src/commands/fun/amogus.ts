import { Command } from "@beni69/cmd";
import decodeGif from "decode-gif";
import { readFileSync } from "fs";
import { ascii } from "./asciiImg";

let running = false;

export const command = new Command(
    {
        names: ["amogus", "amongus", "sus", "ඞ"],
    },
    async ({ message }) => {
        if (running)
            return message.channel.send(
                "Already running. Wait a couple of seconds and try again."
            );
        running = true;
        const gif = decodeGif(readFileSync("img/sus.gif"));
        const asciiFrames = await ascii(gif);

        const msg = await message.channel.send("get stick bugged lol");
        for (let i = 0; i < 5; i++) {
            for (const frame of asciiFrames) {
                await msg.edit(frame, { code: true });
                await new Promise(r => setTimeout(r, 1000));
            }
        }

        running = false;
    }
);
