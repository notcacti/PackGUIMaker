import path from "path";
import * as unzipper from "unzipper";
import { createCanvas, Image, loadImage } from "canvas";
import fs, { PathLike } from "fs";
import sharp from "sharp";

const tempPath = path.join(process.cwd(), "temp");
if (!fs.existsSync(tempPath)) {
    fs.mkdirSync(tempPath);
}

const packFileName = "pack";
const xpNotFullValPercent = 69 / 100; // DON'T USE 100% IT WILL 100% BREAK
const upscale = true;
const upscaleRate = 10;

const packPath = path.join(process.cwd(), "__mocks__", `${packFileName}.zip`);
const packSavePath = path.join(tempPath, packFileName);

await unzipFile(packPath, packSavePath);

const guiFolderPath = path.join(
    packSavePath,
    "assets",
    "minecraft",
    "textures",
    "gui"
);

const iconsPath = path.join(guiFolderPath, "icons.png");
const widgetsPath = path.join(guiFolderPath, "widgets.png");

const iconsSavePath = path.join(tempPath, "icons");
if (!fs.existsSync(iconsSavePath)) {
    fs.mkdirSync(iconsSavePath);
}

const widgetsSavePath = path.join(tempPath, "widgets");
if (!fs.existsSync(widgetsSavePath)) {
    fs.mkdirSync(widgetsSavePath);
}

const uiSavePath = path.join(process.cwd(), "UIs");
if (!fs.existsSync(uiSavePath)) {
    fs.mkdirSync(uiSavePath);
}

const savePaths = {
    firstTwoSlots: path.join(widgetsSavePath, "firstTwoSlots.png"),
    lastSlot: path.join(widgetsSavePath, "lastSlot.png"),
    selector: path.join(widgetsSavePath, "selector.png"),
    gui: path.join(widgetsSavePath, "gui.png"),
    hunger: path.join(iconsSavePath, "hunger.png"),
    hungerBg: path.join(iconsSavePath, "hungerBg.png"),
    heart: path.join(iconsSavePath, "heart.png"),
    heartBg: path.join(iconsSavePath, "heartBg.png"),
    xpEmpty: path.join(iconsSavePath, "xpEmpty.png"),
    xp: path.join(iconsSavePath, "xp.png"),
    armor: path.join(iconsSavePath, "armor.png"),
    uiImg: path.join(uiSavePath, `${packFileName}_ui.png`),
};

interface Coordinates {
    x: number;
    y: number;
    width: number;
    height: number;
}

let res = await getResolution(iconsPath);
let scalingFactor = res / 16;

const iconCoordinates: { [key: string]: Coordinates } = {
    hunger: {
        x: 52 * scalingFactor,
        y: 27 * scalingFactor,
        width: 9 * scalingFactor,
        height: 9 * scalingFactor,
    },
    hungerBg: {
        x: 16 * scalingFactor,
        y: 27 * scalingFactor,
        width: 9 * scalingFactor,
        height: 9 * scalingFactor,
    },
    heart: {
        x: 52 * scalingFactor,
        y: 0 * scalingFactor,
        width: 9 * scalingFactor,
        height: 9 * scalingFactor,
    },
    heartBg: {
        x: 16 * scalingFactor,
        y: 0 * scalingFactor,
        width: 9 * scalingFactor,
        height: 9 * scalingFactor,
    },
    armor: {
        x: 34 * scalingFactor,
        y: 9 * scalingFactor,
        width: 9 * scalingFactor,
        height: 9 * scalingFactor,
    },
};

const guiCoordinates: { [key: string]: Coordinates } = {
    firstTwoSlots: {
        x: 0,
        y: 0,
        width: 40 * scalingFactor,
        height: 23 * scalingFactor,
    },
    lastSlot: {
        x: 160 * scalingFactor,
        y: 0,
        width: 23 * scalingFactor,
        height: 23 * scalingFactor,
    },
    selector: {
        x: 2 * scalingFactor,
        y: 22 * scalingFactor,
        width: 22 * scalingFactor,
        height: 22 * scalingFactor,
    },
};

await preProcessFixes();
await processGUI();
await processIcons();
await generateUI();
clean();

async function preProcessFixes() {
    const widgetsDims = {
        width: (await loadImage(widgetsPath)).width,
        height: (await loadImage(widgetsPath)).height,
    };

    const iconsDims = {
        width: (await loadImage(iconsPath)).width,
        height: (await loadImage(iconsPath)).height,
    };

    if (widgetsDims === iconsDims) return;
    if (widgetsDims.width < iconsDims.width) {
        const imageBuffer = await upscaleImage(
            widgetsPath,
            ~~(iconsDims.width / widgetsDims.width)
        );
        fs.writeFileSync(widgetsPath, imageBuffer);
    } else if (iconsDims.width < widgetsDims.width) {
        const imageBuffer = await upscaleImage(
            iconsPath,
            ~~(widgetsDims.width / iconsDims.width)
        );
        fs.writeFileSync(iconsPath, imageBuffer);
    }
}

async function getResolution(spriteSheetPath: string) {
    return ~~((await loadImage(spriteSheetPath)).height / 16);
}

async function processIcons() {
    console.log("STARTED PROCESSING ICONS");

    const guiImg = await loadImage(savePaths.gui);

    const dynamicIconCoordinates = {
        xpEmpty: {
            x: 182 * scalingFactor - guiImg.width,
            y: 64 * scalingFactor,
            width: guiImg.width,
            height: 5 * scalingFactor,
        },
        xp: {
            x: 0 * scalingFactor,
            y: 69 * scalingFactor,
            width: guiImg.width * xpNotFullValPercent,
            height: 5 * scalingFactor,
        },
    };

    /* ---- Hunger ---- */
    await extractPart(
        iconsPath,
        savePaths.hunger,
        iconCoordinates.hunger.x,
        iconCoordinates.hunger.y,
        iconCoordinates.hunger.width,
        iconCoordinates.hunger.height,
        "HUNGER"
    );
    await extractPart(
        iconsPath,
        savePaths.hungerBg,
        iconCoordinates.hungerBg.x,
        iconCoordinates.hungerBg.y,
        iconCoordinates.hungerBg.width,
        iconCoordinates.hungerBg.height,
        "HUNGER_BACKGROUND"
    );

    /* ---- Hearts ---- */
    await extractPart(
        iconsPath,
        savePaths.heart,
        iconCoordinates.heart.x,
        iconCoordinates.heart.y,
        iconCoordinates.heart.width,
        iconCoordinates.heart.height,
        "HEART"
    );
    await extractPart(
        iconsPath,
        savePaths.heartBg,
        iconCoordinates.heartBg.x,
        iconCoordinates.heartBg.y,
        iconCoordinates.heartBg.width,
        iconCoordinates.heartBg.height,
        "HEART_BACKGROUND"
    );

    /* ---- XP ---- */
    await extractPart(
        iconsPath,
        savePaths.xpEmpty,
        dynamicIconCoordinates.xpEmpty.x,
        dynamicIconCoordinates.xpEmpty.y,
        dynamicIconCoordinates.xpEmpty.width,
        dynamicIconCoordinates.xpEmpty.height,
        "XP_BAR_EMPTY"
    );
    await extractPart(
        iconsPath,
        savePaths.xp,
        dynamicIconCoordinates.xp.x,
        dynamicIconCoordinates.xp.y,
        dynamicIconCoordinates.xp.width,
        dynamicIconCoordinates.xp.height,
        "XP_BAR"
    );

    /* ---- Armor ---- */
    await extractPart(
        iconsPath,
        savePaths.armor,
        iconCoordinates.armor.x,
        iconCoordinates.armor.y,
        iconCoordinates.armor.width,
        iconCoordinates.armor.height,
        "ARMOR"
    );

    /* Combining Specific Icons (Heart, Hunger, XP) */
    await combineParts(
        { lowerIcon: savePaths.heartBg, upperIcon: savePaths.heart },
        savePaths.heart,
        "HEART"
    );
    await combineParts(
        { lowerIcon: savePaths.hungerBg, upperIcon: savePaths.hunger },
        savePaths.hunger,
        "HUNGER"
    );
    await combineParts(
        { lowerIcon: savePaths.xpEmpty, upperIcon: savePaths.xp },
        savePaths.xp,
        "XP_BAR"
    );

    console.log("FINISHED PROCESSING ICONS");
}

async function processGUI() {
    console.log("STARTED PROCESSING WIDGETS");

    /* ---- Extract Parts ---- */
    await extractPart(
        widgetsPath,
        savePaths.firstTwoSlots,
        guiCoordinates.firstTwoSlots.x,
        guiCoordinates.firstTwoSlots.y,
        guiCoordinates.firstTwoSlots.width,
        guiCoordinates.firstTwoSlots.height,
        "FIRST_TWO"
    );
    await extractPart(
        widgetsPath,
        savePaths.lastSlot,
        guiCoordinates.lastSlot.x,
        guiCoordinates.lastSlot.y,
        guiCoordinates.lastSlot.width,
        guiCoordinates.lastSlot.height,
        "LAST_SLOT"
    );
    await extractPart(
        widgetsPath,
        savePaths.selector,
        guiCoordinates.selector.x,
        guiCoordinates.selector.y,
        guiCoordinates.selector.width,
        guiCoordinates.selector.height,
        "SELECTOR"
    );

    /* ---- Combine Parts ---- */
    await combineParts(
        {
            lowerIcon: savePaths.firstTwoSlots,
            upperIcon: savePaths.lastSlot,
            extraIcon: savePaths.selector,
        },
        savePaths.gui,
        "GUI"
    );

    console.log("FINISHED PROCESSING WIDGETS");
}

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
        ctx.drawImage(
            selector,
            upperIcon.width - 2 * scalingFactor,
            (selector.height - lowerIcon.height) / 2
        );

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

async function generateUI() {
    console.log("GENERATING UI");

    type ImageKeys = "heart" | "hunger" | "armor" | "gui" | "xp";

    const images: ImageKeys[] = ["heart", "hunger", "armor", "gui", "xp"];
    const loadedImages: { [key in ImageKeys]?: Image } = {};

    for (const image of images) {
        loadedImages[image] = await loadImage(savePaths[image]);
    }

    const repeatedImages: { [key in ImageKeys]?: Image } = {};
    const repeatIcons: ImageKeys[] = ["heart", "hunger", "armor"];

    for (const icon of repeatIcons) {
        const repeatedImage = new Image();
        repeatedImage.src = repeatIcon(loadedImages[icon]!, 3);
        repeatedImages[icon] = repeatedImage;
    }

    const canvasHeight =
        loadedImages.xp!.height +
        repeatedImages.heart!.height +
        loadedImages.gui!.height +
        repeatedImages.armor!.height +
        3;

    const canvas = createCanvas(loadedImages.xp!.width, canvasHeight);
    const ctx = canvas.getContext("2d");

    const positions = [
        {
            image: loadedImages.gui!,
            x: 0,
            y: canvas.height - loadedImages.gui!.height,
        },
        {
            image: loadedImages.xp!,
            x: 0,
            y:
                canvas.height -
                loadedImages.gui!.height -
                loadedImages.xp!.height -
                1,
        },
        {
            image: repeatedImages.heart!,
            x: 0,
            y:
                canvas.height -
                loadedImages.gui!.height -
                loadedImages.xp!.height -
                repeatedImages.heart!.height -
                2,
        },
        {
            image: repeatedImages.hunger!,
            x: canvas.width - repeatedImages.hunger!.width,
            y:
                canvas.height -
                loadedImages.gui!.height -
                loadedImages.xp!.height -
                repeatedImages.heart!.height -
                2,
        },
        {
            image: repeatedImages.armor!,
            x: 0,
            y:
                canvas.height -
                loadedImages.gui!.height -
                loadedImages.xp!.height -
                repeatedImages.heart!.height -
                repeatedImages.armor!.height -
                3,
        },
    ];

    for (const pos of positions) {
        ctx.drawImage(pos.image, pos.x, pos.y);
    }

    const uiBuffer = canvas.toBuffer();

    let imgBuffer;
    if (upscale) {
        imgBuffer = await upscaleImage(uiBuffer, upscaleRate);
    } else {
        imgBuffer = uiBuffer;
    }

    fs.writeFileSync(savePaths.uiImg, imgBuffer!);

    console.log("COMPLETED PROCESS");
}

// shameless edited chatgpt code
async function upscaleImage(input: string | Buffer, scale: number) {
    const image = sharp(input);

    // Get the original image's metadata (e.g., width and height)
    const metadata = await image.metadata();

    const width = metadata.width! * scale;
    const height = metadata.height! * scale;

    // Resize the image using nearest neighbor interpolation
    const upscaledBuffer = await image
        .resize(width, height, {
            kernel: sharp.kernel.nearest, // Use nearest neighbor interpolation
        })
        .toBuffer(); // Save the upscaled image

    return upscaledBuffer;
}

function unzipFile(zipFilePath: string, outputDir: string) {
    return new Promise<void>((resolve, reject) => {
        fs.createReadStream(zipFilePath)
            .pipe(unzipper.Extract({ path: outputDir }))
            .on("close", () => {
                resolve();
            })
            .on("error", (err) => {
                console.error("Error during unzip:", err);
                reject();
            });
    });
}

function clean() {
    fs.rmSync(path.join(tempPath), { recursive: true, force: true });
}
