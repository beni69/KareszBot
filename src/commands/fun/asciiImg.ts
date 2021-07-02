import { Command } from "@beni69/cmd";
import decodeGif from "decode-gif";
import { ascii, code, download } from ".";

let running = false;

export const command = new Command(
    {
        names: ["asciiImg", "img"],
        description: "turn an image to ascii art",
        noSlash: true,
    },
    async ({ trigger }) => {
        if (trigger.isSlash()) return false;
        const message = trigger.source;

        if (!message.attachments.size) {
            message.channel.send("No image attachment detected.");
            return false;
        }

        if (message.attachments.first()?.url.endsWith(".gif")) {
            //* gif mode
            if (running) {
                trigger.reply(
                    "Already running. Wait a couple of seconds and try again."
                );
                return false;
            }
            running = true;

            const gif = decodeGif(
                await download(message.attachments.first()!.url)
            );
            const gifLength = gif.frames[gif.frames.length - 1].timeCode;

            if (gifLength > 5000) {
                message.channel.send(
                    "Sorry, gifs longer than 5 seconds are not supported at the moment."
                );
            }

            const asciiFrames = await ascii(gif);

            const getLength = (l: number) => Math.round(l / 100) / 0.2;
            const sleep = async (t = 1000) =>
                await new Promise(r => setTimeout(r, t));

            const msg = await message.channel.send("gif incoming..");

            if (gifLength < 1000)
                for (let i = 0; i < 3; i++) {
                    for (const frame of asciiFrames) {
                        await msg.edit(code(frame));
                        await sleep();
                    }
                }
            else
                for (const frame of asciiFrames) {
                    await msg.edit(code(frame));
                    await sleep();
                }

            running = false;
        } else {
            //* image mode
            const img = (await ascii(
                message.attachments.first()!.url
            )) as string;
            if (!img) return false;

            message.channel.send(code(img));
        }
    }
);
