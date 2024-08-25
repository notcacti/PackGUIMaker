import { createCanvas, Image, loadImage } from "@napi-rs/canvas";
import fs from "fs";
import { createConfig, setValue } from "./utils/configUtils.js";
import { getPaths, initializePaths } from "./helpers/paths.js";
import { checkBedrock, getScale, unzipFile } from "./utils/utils.js";
import path from "path";

export const configPath = path.join(process.cwd(), "config.json");

async function main() {
    // Variables that would be auto-generated.
    const packZipPath = path.join(process.cwd(), "__mocks__", "pack.zip");
    const upscaleRate = 10;
    const xpPercent = 50 / 100;

    // Initialise Config.
    initialize(packZipPath, upscaleRate, xpPercent);
}

// packZipPath - path exactly to the pack zip file.
// initialises paths and config
function initialize(
    packZipPath: string,
    upscaleRate: number,
    xpPercent: number
) {
    createConfig(); // Initialize Config.

    try {
        // Pack Initialisation
        const packFileName = packZipPath.split("/").pop();
        setValue("packFileName", packFileName, "insert"); // Set the name in config.

        const folderPaths = getPaths("SYS"); // Get Paths.

        unzipFile(packZipPath, folderPaths.packFolder); // Saves to folderPath.packFolder

        const bedrock = checkBedrock(folderPaths.packFolder);
        setValue("bedrock", bedrock, "insert");

        initializePaths(getPaths("SYS")); // Creates the folders from those paths. (Re-calling getPaths() because it will refresh the paths.)

        const scalingFactor = getScale(getPaths("SYS").packIconsPath);
        setValue("scalingFactor", scalingFactor, "insert");

        setValue("upscaleRate", upscaleRate, "insert");
        setValue("xpPercent", xpPercent, "insert");
    } catch (err) {
        console.error("Error while initialising: " + err);
    }
}

// async function preProcessFixes() {
//     const widgetsDims = {
//         width: (await loadImage(widgetsPath)).width,
//         height: (await loadImage(widgetsPath)).height,
//     };

//     const iconsDims = {
//         width: (await loadImage(iconsPath)).width,
//         height: (await loadImage(iconsPath)).height,
//     };

//     if (widgetsDims === iconsDims) return;
//     if (widgetsDims.width < iconsDims.width) {
//         const imageBuffer = await upscaleImage(
//             widgetsPath,
//             ~~(iconsDims.width / widgetsDims.width)
//         );
//         fs.writeFileSync(widgetsPath, imageBuffer);
//     } else if (iconsDims.width < widgetsDims.width) {
//         const imageBuffer = await upscaleImage(
//             iconsPath,
//             ~~(widgetsDims.width / iconsDims.width)
//         );
//         fs.writeFileSync(iconsPath, imageBuffer);
//     }
// }

// async function processIcons() {
//     console.log("STARTED PROCESSING ICONS");

//     const guiImg = await loadImage(savePaths.gui);

//     const dynamicIconCoordinates = {
//         xpEmpty: {
//             x: 182 * scalingFactor - guiImg.width,
//             y: 64 * scalingFactor,
//             width: guiImg.width,
//             height: 5 * scalingFactor,
//         },
//         xp: {
//             x: 0 * scalingFactor,
//             y: 69 * scalingFactor,
//             width: guiImg.width * xpNotFullValPercent,
//             height: 5 * scalingFactor,
//         },
//     };

//     /* ---- Hunger ---- */
//     await extractPart(
//         iconsPath,
//         savePaths.hunger,
//         iconCoordinates.hunger.x,
//         iconCoordinates.hunger.y,
//         iconCoordinates.hunger.width,
//         iconCoordinates.hunger.height,
//         "HUNGER"
//     );
//     await extractPart(
//         iconsPath,
//         savePaths.hungerBg,
//         iconCoordinates.hungerBg.x,
//         iconCoordinates.hungerBg.y,
//         iconCoordinates.hungerBg.width,
//         iconCoordinates.hungerBg.height,
//         "HUNGER_BACKGROUND"
//     );

//     /* ---- Hearts ---- */
//     await extractPart(
//         iconsPath,
//         savePaths.heart,
//         iconCoordinates.heart.x,
//         iconCoordinates.heart.y,
//         iconCoordinates.heart.width,
//         iconCoordinates.heart.height,
//         "HEART"
//     );
//     await extractPart(
//         iconsPath,
//         savePaths.heartBg,
//         iconCoordinates.heartBg.x,
//         iconCoordinates.heartBg.y,
//         iconCoordinates.heartBg.width,
//         iconCoordinates.heartBg.height,
//         "HEART_BACKGROUND"
//     );

//     /* ---- XP ---- */
//     await extractPart(
//         iconsPath,
//         savePaths.xpEmpty,
//         dynamicIconCoordinates.xpEmpty.x,
//         dynamicIconCoordinates.xpEmpty.y,
//         dynamicIconCoordinates.xpEmpty.width,
//         dynamicIconCoordinates.xpEmpty.height,
//         "XP_BAR_EMPTY"
//     );
//     await extractPart(
//         iconsPath,
//         savePaths.xp,
//         dynamicIconCoordinates.xp.x,
//         dynamicIconCoordinates.xp.y,
//         dynamicIconCoordinates.xp.width,
//         dynamicIconCoordinates.xp.height,
//         "XP_BAR"
//     );

//     /* ---- Armor ---- */
//     await extractPart(
//         iconsPath,
//         savePaths.armor,
//         iconCoordinates.armor.x,
//         iconCoordinates.armor.y,
//         iconCoordinates.armor.width,
//         iconCoordinates.armor.height,
//         "ARMOR"
//     );

//     /* Combining Specific Icons (Heart, Hunger, XP) */
//     await combineParts(
//         { lowerIcon: savePaths.heartBg, upperIcon: savePaths.heart },
//         savePaths.heart,
//         "HEART"
//     );
//     await combineParts(
//         { lowerIcon: savePaths.hungerBg, upperIcon: savePaths.hunger },
//         savePaths.hunger,
//         "HUNGER"
//     );
//     await combineParts(
//         { lowerIcon: savePaths.xpEmpty, upperIcon: savePaths.xp },
//         savePaths.xp,
//         "XP_BAR"
//     );

//     console.log("FINISHED PROCESSING ICONS");
// }

// async function processGUI() {
//     console.log("STARTED PROCESSING WIDGETS");

//     /* ---- Extract Parts ---- */
//     await extractPart(
//         widgetsPath,
//         savePaths.firstTwoSlots,
//         guiCoordinates.firstTwoSlots.x,
//         guiCoordinates.firstTwoSlots.y,
//         guiCoordinates.firstTwoSlots.width,
//         guiCoordinates.firstTwoSlots.height,
//         "FIRST_TWO"
//     );
//     await extractPart(
//         widgetsPath,
//         savePaths.lastSlot,
//         guiCoordinates.lastSlot.x,
//         guiCoordinates.lastSlot.y,
//         guiCoordinates.lastSlot.width,
//         guiCoordinates.lastSlot.height,
//         "LAST_SLOT"
//     );
//     await extractPart(
//         widgetsPath,
//         savePaths.selector,
//         guiCoordinates.selector.x,
//         guiCoordinates.selector.y,
//         guiCoordinates.selector.width,
//         guiCoordinates.selector.height,
//         "SELECTOR"
//     );

//     /* ---- Combine Parts ---- */
//     await combineParts(
//         {
//             lowerIcon: savePaths.firstTwoSlots,
//             upperIcon: savePaths.lastSlot,
//             extraIcon: savePaths.selector,
//         },
//         savePaths.gui,
//         "GUI"
//     );

//     console.log("FINISHED PROCESSING WIDGETS");
// }

// async function generateUI() {
//     console.log("GENERATING UI");

//     type ImageKeys = "heart" | "hunger" | "armor" | "gui" | "xp";

//     const images: ImageKeys[] = ["heart", "hunger", "armor", "gui", "xp"];
//     const loadedImages: { [key in ImageKeys]?: Image } = {};

//     for (const image of images) {
//         loadedImages[image] = await loadImage(savePaths[image]);
//     }

//     const repeatedImages: { [key in ImageKeys]?: Image } = {};
//     const repeatIcons: ImageKeys[] = ["heart", "hunger", "armor"];

//     for (const icon of repeatIcons) {
//         const repeatedImage = new Image();
//         repeatedImage.src = repeatIcon(loadedImages[icon]!, 3);
//         repeatedImages[icon] = repeatedImage;
//     }

//     const canvasHeight =
//         loadedImages.xp!.height +
//         repeatedImages.heart!.height +
//         loadedImages.gui!.height +
//         repeatedImages.armor!.height +
//         3;

//     const canvas = createCanvas(loadedImages.xp!.width, canvasHeight);
//     const ctx = canvas.getContext("2d");

//     const positions = [
//         {
//             image: loadedImages.gui!,
//             x: 0,
//             y: canvas.height - loadedImages.gui!.height,
//         },
//         {
//             image: loadedImages.xp!,
//             x: 0,
//             y:
//                 canvas.height -
//                 loadedImages.gui!.height -
//                 loadedImages.xp!.height -
//                 1,
//         },
//         {
//             image: repeatedImages.heart!,
//             x: 0,
//             y:
//                 canvas.height -
//                 loadedImages.gui!.height -
//                 loadedImages.xp!.height -
//                 repeatedImages.heart!.height -
//                 2,
//         },
//         {
//             image: repeatedImages.hunger!,
//             x: canvas.width - repeatedImages.hunger!.width,
//             y:
//                 canvas.height -
//                 loadedImages.gui!.height -
//                 loadedImages.xp!.height -
//                 repeatedImages.heart!.height -
//                 2,
//         },
//         {
//             image: repeatedImages.armor!,
//             x: 0,
//             y:
//                 canvas.height -
//                 loadedImages.gui!.height -
//                 loadedImages.xp!.height -
//                 repeatedImages.heart!.height -
//                 repeatedImages.armor!.height -
//                 3,
//         },
//     ];

//     for (const pos of positions) {
//         ctx.drawImage(pos.image, pos.x, pos.y);
//     }

//     const uiBuffer = canvas.toBuffer();

//     let imgBuffer;
//     if (upscale) {
//         imgBuffer = await upscaleImage(uiBuffer, upscaleRate);
//     } else {
//         imgBuffer = uiBuffer;
//     }

//     fs.writeFileSync(savePaths.uiImg, imgBuffer!);

//     console.log("COMPLETED PROCESS");
// }
