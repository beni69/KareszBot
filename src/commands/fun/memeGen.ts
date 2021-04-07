import { Command } from "@beni69/cmd";
import { createCanvas, ImageData, loadImage } from "canvas";
import decodeGif from "decode-gif";
import { MessageAttachment } from "discord.js";
// @ts-ignore
import Gifencoder from "gifencoder";
import { download } from "./fun";

export const command = new Command(
    { names: ["memegen", "meme"] },
    async ({ message, argv, text }) => {
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
                const canvas = await captionImage(imgURL);
                if (!canvas) return;

                message.channel.send(
                    new MessageAttachment(
                        canvas.toBuffer(),
                        "karesz-memegen.png"
                    )
                );
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
                const canvas = await captionImage(frameToBuffer(frame));
                if (!canvas) continue;

                encoder.addFrame(canvas.getContext("2d"));
            }
            encoder.finish();

            const buffer = encoder.out.getData();
            message.channel.send(
                new MessageAttachment(buffer, "karesz-memegen.gif")
            );
        } else {
            //* image mode
            const canvas = await captionImage(imgURL);
            if (!canvas) return;

            message.channel.send(
                new MessageAttachment(canvas.toBuffer(), "karesz-memegen.png")
            );
        }

        async function captionImage(src: string | Buffer) {
            const img = await loadImage(src).catch(e => {
                console.error(e);
                message.reply(`${e}`);
            });
            if (!img) return false;

            const canvas = createCanvas(img.width, img.height);
            const ctx = canvas.getContext("2d");

            //* processing image
            ctx.drawImage(img, 0, 0);

            const fontSize = p(img.height, 12);
            ctx.font = `${fontSize}px Impact`;
            ctx.fillStyle = "#ffffff";
            ctx.textAlign = "center";
            ctx.lineWidth = p(fontSize, 3.5);
            ctx.shadowOffsetX = 3;
            ctx.shadowOffsetY = 3;
            ctx.shadowBlur = 4;
            ctx.shadowColor = "rgba(0,0,0,1)";

            ctx.fillText(
                topText.toUpperCase(),
                img.width / 2,
                p(img.height, 15),
                p(img.width, 80)
            );
            ctx.fillText(
                bottomText.toUpperCase(),
                img.width / 2,
                img.height - p(img.height, 5),
                p(img.width, 80)
            );

            ctx.shadowColor = "rgba(0,0,0,0)";
            ctx.strokeText(
                topText.toUpperCase(),
                img.width / 2,
                p(img.height, 15),
                p(img.width, 80)
            );
            ctx.strokeText(
                bottomText.toUpperCase(),
                img.width / 2,
                img.height - p(img.height, 5),
                p(img.width, 80)
            );

            return canvas;
        }
    }
);

const p = (num: number, percent: number) => num * (percent / 100);
