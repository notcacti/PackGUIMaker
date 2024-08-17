import path from "path";
import * as unzipper from "unzipper";
import { createCanvas, loadImage } from "canvas";
import fs from "fs";

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

const packPath = path.join(process.cwd(), "__mocks__", `${packFileName}.zip`);
const packSavePath = path.join(tempPath, packFileName);

await unzipFile(packPath, packSavePath);

const guiFolderPath = path.join(
    tempPath,
    packFileName,
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

await cropAppIcons();
fs.rmSync(packSavePath, { recursive: true, force: true });

async function cropAppIcons() {
    await extractIcon(
        iconsPath,
        path.join(iconsSavePath, "heartBg.png"),
        16,
        0,
        "HEART_BACKGROUND"
    ); // Get Heart Background
    await extractIcon(
        iconsPath,
        path.join(iconsSavePath, "hungerBg.png"),
        16,
        27,
        "HUNGER_BACKGROUND"
    ); // Get Hunger Background
    await extractIcon(
        iconsPath,
        path.join(iconsSavePath, "armor.png"),
        34,
        9,
        "ARMOR"
    ); // Get Armor
    await extractIcon(
        iconsPath,
        path.join(iconsSavePath, "heart.png"),
        53,
        0,
        "HEART"
    ); // Get Heart
    await extractIcon(
        iconsPath,
        path.join(iconsSavePath, "hunger.png"),
        52,
        27,
        "HUNGER"
    ); // Get Hunger

    console.log("extracted all icons (except xpbar)!");
}

async function extractIcon(
    spriteSheetPath: string,
    outputPath: string,
    x: number, // the x coordinate of the icon
    y: number, // the y coordinate of the icon
    name: string
) {
    const spriteImage = await loadImage(spriteSheetPath);
    const spriteSize = 9;

    const canvas = createCanvas(spriteSize, spriteSize);
    const ctx = canvas.getContext("2d");

    ctx.drawImage(
        spriteImage,
        x,
        y,
        spriteSize,
        spriteSize,
        0,
        0,
        spriteSize,
        spriteSize
    );

    const iconBuffer = canvas.toBuffer("image/png");

    fs.writeFileSync(outputPath, iconBuffer);

    name
        ? console.log(
              `The ${name} icon was extracted and saved to ${outputPath}`
          )
        : console.log(
              `An unknown icon was extracted and saved to ${outputPath}`
          );
}

function unzipFile(zipFilePath: string, outputDir: string) {
    return new Promise<void>((resolve, reject) => {
        fs.createReadStream(zipFilePath)
            .pipe(unzipper.Extract({ path: outputDir }))
            .on("close", () => {
                console.log(`Unzipped successfully to ${outputDir}`);
                resolve();
            })
            .on("error", (err) => {
                console.error("Error during unzip:", err);
                reject();
            });
    });
}
