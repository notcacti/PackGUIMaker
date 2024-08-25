import { createCanvas, Image, loadImage } from "@napi-rs/canvas";
import fs from "fs";
import sharp from "sharp";
import { IIconInfo } from "../types.js";

export async function upscaleImage(input: string | Buffer, scale: number) {
    const image = sharp(input);
    if (image.errored) {
        // image.errored is the actual error message.
        throw image.errored;
    }

    const metadata = await image.metadata();

    const width = metadata.width! * scale;
    const height = metadata.height! * scale;

    const upscaledBuffer = await image
        .resize(width, height, {
            kernel: sharp.kernel.nearest,
        })
        .toBuffer();

    return upscaledBuffer;
}

function calculateCanvasSize(icons: IIconInfo[]): {
    width: number;
    height: number;
} {
    let maxWidth = 0;
    let maxHeight = 0;

    for (const icon of icons) {
        const { x, y, width, height } = icon.destCoordinates;
        maxWidth = Math.max(maxWidth, x + width);
        maxHeight = Math.max(maxHeight, y + height);
    }

    return { width: maxWidth, height: maxHeight };
}

export async function combineIcons(icons: IIconInfo[], outputPath: string) {
    const { width, height } = calculateCanvasSize(icons);

    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    for (const icon of icons) {
        const image = await loadImage(icon.path);
        ctx.drawImage(
            image,
            icon.destCoordinates.x,
            icon.destCoordinates.y,
            image.width,
            image.height
        );
    }

    fs.writeFileSync(outputPath, canvas.toBuffer("image/png"));
    return;
}

export function cropIcon(
    spriteSheetPath: string,
    outputPath: string,
    x: number, // the x coordinate of the icon
    y: number, // the y coordinate of the icon
    width: number,
    height: number
) {
    loadImage(spriteSheetPath)
        .then((spriteImage) => {
            const spriteSize = {
                width,
                height,
            };

            const canvas = createCanvas(spriteSize.width, spriteSize.height);
            const ctx = canvas.getContext("2d");

            ctx.drawImage(
                spriteImage,
                x,
                y,
                spriteSize.width,
                spriteSize.height,
                0,
                0,
                spriteSize.width,
                spriteSize.height
            );

            const iconBuffer = canvas.toBuffer("image/png");

            fs.writeFileSync(outputPath, iconBuffer);
        })
        .catch((err) => {
            throw new Error("Error while cropping image: " + err);
        });

    return;
}

export async function repeatIcon(
    imagePath: string,
    times: number,
    outputPath: string
) {
    const image = await loadImage(imagePath);

    const canvas = createCanvas(image.width * times, image.height);
    const context = canvas.getContext("2d");

    for (let i = 0; i <= times; i++) {
        context.drawImage(image, image.width * i, 0);
    }
    const repeatedIconBuffer = canvas.toBuffer("image/png");

    savePngBuffer(repeatedIconBuffer, outputPath);

    return;
}

export function savePngBuffer(buffer: Buffer, outputPath: string) {
    try {
        fs.writeFileSync(buffer, outputPath);
    } catch (err) {
        console.error("Error while saving PNG buffer: " + err);
        return;
    }
}
