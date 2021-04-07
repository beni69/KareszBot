import { Command } from "@beni69/cmd";
import { createCanvas, ImageData, loadImage } from "canvas";
import decodeGif from "decode-gif";
import { download } from "./fun";

let running = false;

export const command = new Command(
    { names: ["asciiImg", "img"] },
    async ({ message }) => {
        if (!message.attachments.size) {
            message.channel.send("No image attachment detected.");
            return false;
        }

        if (message.attachments.first()?.url.endsWith(".gif")) {
            //* gif mode
            if (running) {
                message.channel.send(
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
                        await msg.edit(frame, { code: true });
                        await sleep();
                    }
                }
            else
                for (const frame of asciiFrames) {
                    await msg.edit(frame, { code: true });
                    await sleep();
                }

            running = false;
        } else {
            //* image mode
            const img = await ascii(message.attachments.first()!.url);
            if (!img) return false;

            message.channel.send(img, { code: true });
        }
    }
);

export async function ascii(src: string | decodeGif.ResultType) {
    const asciiFrames: string[] = [];
    if (typeof src === "string") {
        //* image mode
        const image = await loadImage(src);
        const [width, height] = getDimensons(image.width, image.height);

        const canvas = createCanvas(width, height);
        const context = canvas.getContext("2d");

        context.drawImage(image, 0, 0, width, height);

        const [imgData, grayScales] = toGrayScales(
            context.getImageData(0, 0, width, height)
        );

        context.putImageData(imgData, 0, 0);

        const ascii = trimEnds(toAscii(grayScales, width));

        return ascii;
    } else {
        //* gif mode
        const [width, height] = getDimensons(src.width, src.height);

        src.frames.forEach((frame, i) => {
            const canvas = createCanvas(src.width, src.height);
            const ctx = canvas.getContext("2d");
            const d = new ImageData(frame.data, src.width, src.height);
            ctx.putImageData(d, 0, 0);

            const c2 = createCanvas(width, height);
            const ctx2 = c2.getContext("2d");
            ctx2.drawImage(canvas, 0, 0, width, height);
            const d2 = ctx2.getImageData(0, 0, width, height);

            const [imgData, grayScales] = toGrayScales(d2);
            ctx2.putImageData(imgData, 0, 0);

            const ascii = trimEnds(toAscii(grayScales, width));

            asciiFrames.push(ascii);
        });
        return asciiFrames;
    }

    function toGrayScale(r: number, g: number, b: number) {
        return 0.21 * r + 0.72 * g + 0.07 * b;
    }

    function toGrayScales(imgData: ImageData): [ImageData, number[]] {
        const grayScales: number[] = [];

        for (let i = 0; i < imgData.data.length; i += 4) {
            const r = imgData.data[i];
            const g = imgData.data[i + 1];
            const b = imgData.data[i + 2];

            const grayScale = toGrayScale(r, g, b);

            imgData.data[i] = imgData.data[i + 1] = imgData.data[
                i + 2
            ] = grayScale;

            grayScales.push(grayScale);
        }

        return [imgData, grayScales];
    }

    function toAscii(grayScales: number[], width: number) {
        // const grayRamp =
        //     "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/|()1{}[]?-_+~<>i!lI;:,\"^`'. "; /* shit af */
        const grayRamp = " .,:;i1tfLCG08@";

        const rampLength = grayRamp.length;

        // the grayScale value is an integer ranging from 0 (black) to 255 (white)
        const getChar = (grayScale: number) =>
            grayRamp[Math.ceil(((rampLength - 1) * grayScale) / 255)];

        const ascii = grayScales.reduce((asc, gry, i) => {
            let nextChars = getChar(gry);

            if ((i + 1) % width === 0) nextChars += "\n";

            return asc + nextChars;
        }, "");

        return ascii;
    }

    function getDimensons(
        width: number,
        height: number,
        MW?: number,
        MH?: number
    ) {
        const MAXIMUM_WIDTH = MW || 25;
        const MAXIMUM_HEIGHT = MH || 25;

        const fr = getFontRatio();
        const frWidth = Math.floor(fr * width);

        if (height > MAXIMUM_HEIGHT) {
            const rWidth = Math.floor((frWidth * MAXIMUM_HEIGHT) / height);
            return [rWidth, MAXIMUM_HEIGHT];
        } else if (width > MAXIMUM_WIDTH) {
            const rHeight = Math.floor((height * MAXIMUM_WIDTH) / frWidth);
            return [MAXIMUM_WIDTH, rHeight];
        } else {
            return [frWidth, height];
        }
    }

    function getFontRatio() {
        const dc = { width: 7, height: 15 };
        return dc.height / dc.width;
    }

    function trimEnds(x: string) {
        return x
            .split(/\n/)
            .map(function (line: string) {
                return line.replace(/\s+$/, "");
            })
            .join("\n");
    }
}
