import { Command } from "@beni69/cmd";
import { createCanvas, loadImage } from "canvas";
import { MessageAttachment } from "discord.js";

export const command = new Command(
    { names: ["memegen", "meme"] },
    async ({ message, argv, text }) => {
        if (!message.attachments.size) {
            message.reply("No image atatchment detected");
            return false;
        }

        const topText = text.split("\n")[0] || "";
        const bottomText = text.split("\n")[1] || "";

        //* loading image
        const img = await loadImage(message.attachments.first()!.url).catch(
            e => {
                console.error(e);
                message.reply(`${e}`);
            }
        );
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

        //* output
        const attch = new MessageAttachment(
            canvas.toBuffer(),
            "karesz-memegen.png"
        );
        message.channel.send("", attch);
    }
);

const p = (num: number, percent: number) => num * (percent / 100);
