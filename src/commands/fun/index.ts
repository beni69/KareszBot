import { createCanvas, loadImage, ImageData } from "canvas";
import decodeGif from "decode-gif";
import fetch from "node-fetch";

export const download = async (url: string) => (await fetch(url)).buffer();

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

            imgData.data[i] =
                imgData.data[i + 1] =
                imgData.data[i + 2] =
                    grayScale;

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

export async function captionImage(
    src: string | Buffer,
    topText: string,
    bottomText: string
) {
    const img = await loadImage(src).catch(e => {
        console.error(e);
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
const p = (num: number, percent: number) => num * (percent / 100);

export const code = (s: string) => "```\n" + s + "\n```";
