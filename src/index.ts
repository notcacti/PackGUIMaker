import path from "path";
import * as unzipper from "unzipper";
import { createCanvas, Image, loadImage } from "canvas";
import fs, { PathLike } from "fs";

// Very useful thanks jezler
/*
    icons_crops = [
        ((52, 0, 61, 9), 'full_heart'),      # Full Heart
        ((61, 0, 67, 9), 'half_heart'),      # Half Heart
        ((16, 9, 25, 18), 'armor_background'), # Armour Background
        ((25, 9, 34, 18), 'half_armor'),     # Half Armour
        ((34, 9, 43, 18), 'full_armor'),     # Full Armour
        ((52, 9, 61, 18), 'heart_background'), # Heart Background
        ((52, 27, 62, 36), 'full_hunger'),   # Full Hunger
        ((62, 27, 70, 36), 'half_hunger'),   # Half Hunger
        ((16, 27, 25, 36), 'hunger_background'), # Hunger Background
        ((0, 64, 182, 69), 'xp_bar_background'), # XP bar background
        ((0, 69, 182, 74), 'xp_bar')         # XP bar
    ]
*/

const tempPath = path.join(process.cwd(), "temp");

const packFileName = "16x";
const xpNotFullValPercent = 40 / 100;

const packPath = path.join(process.cwd(), "__mocks__", `${packFileName}.zip`);
const packSavePath = path.join(tempPath, packFileName);

// await unzipFile(packPath, packSavePath);

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

await processGUI();
await processIcons();
await generateUI();
// clean()

async function processIcons() {
    /* ---- Hunger ---- */
    await extractPart(iconsPath, savePaths.hunger, 52, 27, 9, 9, "HUNGER"); // Get Hunger
    await extractPart(
        iconsPath,
        savePaths.hungerBg,
        16,
        27,
        9,
        9,
        "HUNGER_BACKGROUND"
    ); // Get Hunger Background

    /* ---- Hearts ---- */
    await extractPart(iconsPath, savePaths.heart, 52, 0, 9, 9, "HEART"); // Get Heart
    await extractPart(
        iconsPath,
        savePaths.heartBg,
        16,
        0,
        9,
        9,
        "HEART_BACKGROUND"
    ); // Get Heart Background

    /* ---- XP (NOTE: Total is 182px Wide and 5px High, Adjust Accordingly.) ---- */
    const guiImg = await loadImage(savePaths.gui);
    await extractPart(
        iconsPath,
        savePaths.xpEmpty,
        182 - guiImg.width,
        64,
        guiImg.width,
        5,
        "XP_BAR_EMPTY"
    ); // Get XP Background
    await extractPart(
        iconsPath,
        savePaths.xp,
        0,
        69,
        guiImg.width * xpNotFullValPercent,
        5,
        "XP_BAR"
    ); // Get XP Bar
    /* ---- Armor ---- */
    await extractPart(iconsPath, savePaths.armor, 34, 9, 9, 9, "ARMOR"); // Get Armor

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
}

async function processGUI() {
    await extractPart(
        widgetsPath,
        savePaths.firstTwoSlots,
        0,
        0,
        40,
        23,
        "FIRST_TWO"
    );
    await extractPart(
        widgetsPath,
        savePaths.lastSlot,
        160,
        0,
        23,
        23,
        "LAST_SLOT"
    );
    await extractPart(
        widgetsPath,
        savePaths.selector,
        1,
        23,
        22,
        22,
        "SELECTOR"
    );

    await combineParts(
        {
            lowerIcon: savePaths.firstTwoSlots,
            upperIcon: savePaths.lastSlot,
            extraIcon: savePaths.selector,
        },
        savePaths.gui,
        "GUI"
    );
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

    if (name === "GUI" && iconPaths.extraIcon) {
        const firstTwoSlots = lowerIcon;
        const lastSlot = upperIcon;
        const selector = await loadImage(iconPaths.extraIcon.toString()); // selector

        const canvas = createCanvas(
            firstTwoSlots.width + lastSlot.width,
            selector.height
        );
        const ctx = canvas.getContext("2d");

        ctx.drawImage(firstTwoSlots, 0, 1);
        ctx.drawImage(lastSlot, firstTwoSlots.width, 1);
        ctx.drawImage(selector, lastSlot.width, 0);

        const guiBuffer = canvas.toBuffer();
        fs.writeFileSync(outputPath, guiBuffer);
    } else {
        if (
            lowerIcon.width !== upperIcon.width &&
            lowerIcon.height !== upperIcon.height
        )
            return;

        let width = lowerIcon.width;
        let height = lowerIcon.height;

        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext("2d");

        ctx.drawImage(lowerIcon, 0, 0, width, height, 0, 0, width, height);
        ctx.drawImage(upperIcon, 0, 0, width, height, 0, 0, width, height);

        if (name === "XP_BAR") {
            ctx.clearRect(0, 0, 1, 1);
            ctx.clearRect(0, height - 1, 1, 1);
        }

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

function repeatIcon(image: Image) {
    const canvas = createCanvas(image.width * 3, image.height);
    const context = canvas.getContext("2d");

    context.drawImage(image, 0, 0);
    context.drawImage(image, image.width, 0);
    context.drawImage(image, image.width * 2, 0);

    const repeatedIconBuffer = canvas.toBuffer();

    return repeatedIconBuffer;
}

async function generateUI() {
    const heart = await loadImage(savePaths.heart);
    const hunger = await loadImage(savePaths.hunger);
    const armor = await loadImage(savePaths.armor);
    const gui = await loadImage(savePaths.gui);
    const xp = await loadImage(savePaths.xp);

    let heartImage = new Image();
    heartImage.src = repeatIcon(heart);

    let hungerImage = new Image();
    hungerImage.src = repeatIcon(hunger);

    let armorImage = new Image();
    armorImage.src = repeatIcon(armor);

    const canvas = createCanvas(
        xp.width,
        hunger.height + heart.height + xp.height + gui.height + 3
    );
    const ctx = canvas.getContext("2d");

    ctx.drawImage(gui, 0, canvas.height - gui.height);
    ctx.drawImage(xp, 0, canvas.height - gui.height - xp.height - 1);
    ctx.drawImage(
        heartImage,
        0,
        canvas.height - gui.height - xp.height - heartImage.height - 2
    );
    ctx.drawImage(
        hungerImage,
        canvas.width - hungerImage.width,
        canvas.height - gui.height - xp.height - heartImage.height - 2
    );
    ctx.drawImage(
        armorImage,
        0,
        canvas.height -
            gui.height -
            xp.height -
            heartImage.height -
            armorImage.height -
            3
    );

    const uiBuffer = canvas.toBuffer();

    fs.writeFileSync(savePaths.uiImg, uiBuffer);

    console.log("COMPLETED PROCESS");
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
