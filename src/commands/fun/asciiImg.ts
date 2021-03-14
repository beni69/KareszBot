import { Command } from "@beni69/cmd";
import { createCanvas, ImageData, loadImage } from "canvas";
import decodeGif from "decode-gif";
import { readFileSync } from "fs";

let running = false;

export const command = new Command({ names: "img" }, async ({ message }) => {
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
});

export async function ascii(src: string | decodeGif.ResultType) {
    const asciiFrames: string[] = [];
    if (typeof src === "string") {
        const image = await loadImage(src);
        const [width, height] = getDimensons(image.width, image.height);
        console.log({
            iWidth: image.width,
            iHeight: image.height,
            width,
            height,
        });
        const canvas = createCanvas(width, height);
        const context = canvas.getContext("2d");

        context.drawImage(image, 0, 0, width, height);

        const [imgData, grayScales] = toGrayScales(
            context.getImageData(0, 0, width, height)
        );

        context.putImageData(imgData, 0, 0);
        const ascii = trimEnds(toAscii(grayScales, width));

        // output
        // writeFileSync("./out.txt", ascii);

        return asciiFrames;
    } else {
        const [width, height] = getDimensons(src.width, src.height);

        src.frames.forEach((frame, i) => {
            const canvas = createCanvas(src.width, src.height);
            const context = canvas.getContext("2d");
            const d = new ImageData(frame.data, src.width, src.height);
            context.putImageData(d, 0, 0);

            const c2 = createCanvas(width, height);
            const ctx2 = c2.getContext("2d");
            ctx2.drawImage(canvas, 0, 0, width, height);
            const d2 = ctx2.getImageData(0, 0, width, height);

            const [imgData, grayScales] = toGrayScales(d2);
            ctx2.putImageData(imgData, 0, 0);

            const ascii = toAscii(grayScales, width);

            // output
            // writeFileSync(`./out${i}.txt`, ascii);
            // writeFileSync(`./out${i}.png`, canvas.toBuffer());

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

    function getDimensons(width: number, height: number) {
        const MAXIMUM_WIDTH = 28;
        const MAXIMUM_HEIGHT = 28;

        const fr = getFontRatio();
        // const fr = 1;
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
