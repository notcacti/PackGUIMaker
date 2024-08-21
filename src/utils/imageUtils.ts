import fs, { PathLike } from "fs";

// TODO:
// Fix this mess of "code"

async function combineParts(
    iconPaths: {
        lowerIcon: PathLike;
        upperIcon: PathLike;
        extraIcon?: PathLike;
    },
    outputPath: PathLike,
    name: string
) {
    const lowerIcon = await loadImage(iconPaths.lowerIcon.toString()); // first 2
    const upperIcon = await loadImage(iconPaths.upperIcon.toString()); // last one

    // hardcoded in because i can't be asked to code it properly 🔥🔥🔥
    if (name === "GUI" && iconPaths.extraIcon) {
        const selector = await loadImage(iconPaths.extraIcon.toString()); // selector

        const canvas = createCanvas(
            guiCoordinates.firstTwoSlots.width + guiCoordinates.lastSlot.width,
            selector.height
        );
        const ctx = canvas.getContext("2d");

        ctx.drawImage(lowerIcon, 0, 1);
        ctx.drawImage(upperIcon, lowerIcon.width, 1);
        ctx.drawImage(selector, upperIcon.width - 1, 0);

        const guiBuffer = canvas.toBuffer();
        fs.writeFileSync(outputPath, guiBuffer);
    } else {
        let width = lowerIcon.width;
        let height = lowerIcon.height;

        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext("2d");

        ctx.drawImage(lowerIcon, 0, 0, width, height, 0, 0, width, height);
        if (name === "XP_BAR") {
            ctx.clearRect(0, 0, scalingFactor, scalingFactor);
            ctx.clearRect(
                0,
                height - scalingFactor,
                scalingFactor,
                scalingFactor
            );
        }
        ctx.drawImage(upperIcon, 0, 0, width, height, 0, 0, width, height);

        const combinedIconBuffer = canvas.toBuffer();
        fs.writeFileSync(outputPath, combinedIconBuffer);
    }
}

async function extractPart(
    spriteSheetPath: string,
    outputPath: string,
    x: number, // the x coordinate of the icon
    y: number, // the y coordinate of the icon
    width: number,
    height: number,
    name: string
) {
    const spriteImage = await loadImage(spriteSheetPath);
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
}

function repeatIcon(image: Image, times: number) {
    const canvas = createCanvas(image.width * times, image.height);
    const context = canvas.getContext("2d");

    for (let i = 0; i <= times; i++) {
        context.drawImage(image, image.width * i, 0);
    }
    const repeatedIconBuffer = canvas.toBuffer();

    return repeatedIconBuffer;
}
