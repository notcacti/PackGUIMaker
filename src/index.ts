import { configPath, createConfig, setValue } from "./utils/configUtils.js";
import { getPaths, initializePaths } from "./helpers/paths.js";
import {
    checkBedrock,
    clean,
    convertBedrock,
    getScale,
    unzipFile,
} from "./utils/utils.js";
import path from "path";
import { crop, imageDimsFix, processImage } from "./helpers/imageProcessing.js";
import { savePngBuffer } from "./utils/imageUtils.js";

// packZipPath - path exactly to the pack zip file.
// initialises paths and config
async function initialize(
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

        // Saves to folderPath.packFolder
        await unzipFile(packZipPath, folderPaths.packFolder);

        const bedrock = checkBedrock(folderPaths.packFolder);
        if (bedrock) convertBedrock(folderPaths.packFolder);
        setValue("bedrock", bedrock, "insert");

        initializePaths(getPaths("SYS")); // Creates the folders from those paths. (Re-calling getPaths() because it will refresh the paths.)

        const scalingFactor = await getScale(getPaths("SYS").packIconsPath);
        setValue("scalingFactor", scalingFactor, "insert");

        setValue("upscaleRate", upscaleRate, "insert");
        setValue("xpPercent", xpPercent, "insert");
    } catch (err) {
        console.error("Error while initialising: " + err);
        process.exit(1);
    }
}

async function main() {
    // Variables that would be auto-generated.
    const packZipPath = path.join(process.cwd(), "__mocks__", "thing.mcpack");
    const upscaleRate = 1;
    const xpPercent = 50 / 100;

    // Initialise Config && Paths.
    await initialize(packZipPath, upscaleRate, xpPercent);

    // Get system paths for saving.
    const systemPaths = getPaths("SYS");

    // Fix differing image sizes. (incase of any)
    try {
        await imageDimsFix(
            systemPaths.packIconsPath,
            systemPaths.packWidgetsPath
        );
    } catch (err) {
        console.error(err);
        process.exit(1);
    }

    // Crop all the sprites from icons.png
    await crop("ICON");
    // Crop all the sprites from gui.png / widgets.png
    await crop("GUI");

    // Process the whole image with the cutouts.
    const uiImageBuffer = await processImage();

    // Remove while developing app.
    // replace with sending to their computer save dialog.
    savePngBuffer(
        uiImageBuffer,
        path.join(
            systemPaths.uiSavePath,
            `${packZipPath.split("/").pop()}_ui.png`
        )
    );

    // clean up extra files
    clean([systemPaths.tempPath, configPath]);

    /* ---- fin. ---- */
    process.exit(0);
}

main();
