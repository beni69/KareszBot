import { Command } from "@beni69/cmd";
import { createCanvas, ImageData, loadImage } from "canvas";
import decodeGif from "decode-gif";
import { MessageAttachment } from "discord.js";
// @ts-ignore
import Gifencoder from "gifencoder";
import { download, captionImage } from ".";

export const command = new Command(
    {
        names: ["meme", "memegen"],
        description: "create a funny meme",
        noSlash: true,
    },
    async ({ trigger, argv, text }) => {
        if (trigger.isSlash()) return false;
        const message = trigger.source;

        if (!message.attachments.size) {
            message.reply("No image atatchment detected");
            return false;
        }

        const topText = text.split("\n")[0] || "";
        const bottomText = text.split("\n")[1] || "";

        //* get image url
        const imgURL = message.attachments.first()!.url;

        //* output
        if (imgURL.endsWith(".gif")) {
            //* gif mode

            const gifFile = await download(imgURL);
            const gifData = decodeGif(gifFile);
            const { width, height } = gifData;

            //* one-frame gif (image mode)
            if (gifData.frames.length == 1) {
                const canvas = await captionImage(imgURL, topText, bottomText);
                if (!canvas) return;

                message.channel.send({
                    files: [
                        new MessageAttachment(
                            canvas.toBuffer(),
                            "karesz-memegen.png"
                        ),
                    ],
                });
                return;
            }

            const delay = gifData.frames[1].timeCode;

            function frameToBuffer(frame: decodeGif.FrameType) {
                const canvas = createCanvas(width, height);
                const ctx = canvas.getContext("2d");
                const d = new ImageData(frame.data, width, height);
                ctx.putImageData(d, 0, 0);
                return canvas.toBuffer();
            }

            const encoder = new Gifencoder(width, height);
            encoder.start();
            encoder.setRepeat(0);
            encoder.setDelay(delay);
            encoder.setQuality(10);

            let i = 0;
            for (const frame of gifData.frames) {
                const canvas = await captionImage(
                    frameToBuffer(frame),
                    topText,
                    bottomText
                );
                if (!canvas) continue;

                encoder.addFrame(canvas.getContext("2d"));
            }
            encoder.finish();

            const buffer = encoder.out.getData();
            message.channel.send({
                files: [new MessageAttachment(buffer, "karesz-memegen.gif")],
            });
        } else {
            //* image mode
            const canvas = await captionImage(imgURL, topText, bottomText);
            if (!canvas) return;

            message.channel.send({
                files: [
                    new MessageAttachment(
                        canvas.toBuffer(),
                        "karesz-memegen.png"
                    ),
                ],
            });
        }
    }
);
