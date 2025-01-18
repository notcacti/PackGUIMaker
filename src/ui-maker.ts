import { configPath, createConfig, setValue } from "./utils/configUtils.js";
import { getPaths, initializePaths } from "./helpers/paths.js";
import {
    checkBedrock,
    clean,
    convertBedrock,
    getScale,
    unzipFile,
} from "./utils/utils.js";
import { crop, imageDimsFix, processImage } from "./helpers/imageProcessing.js";

// packZipPath - path exactly to the pack zip file.
// initialises paths and config
async function initialize(
    packFileName: string,
    packZipBuffer: Buffer,
    upscaleRate: number,
    xpPercent: number
) {
    createConfig(); // Initialize Config.

    try {
        // Pack Initialisation
        setValue("packFileName", packFileName, "insert"); // Set the name in config.

        const folderPaths = getPaths("SYS"); // Get Paths.

        // Saves to folderPath.packFolder
        await unzipFile(packZipBuffer, folderPaths.packFolder);

        const bedrock = checkBedrock(folderPaths.packFolder);
        if (bedrock) convertBedrock(folderPaths.packFolder);
        setValue("bedrock", bedrock, "insert");

        initializePaths(getPaths("SYS")); // Creates the folders from those paths. (Re-calling getPaths() because it will refresh the paths.)

        const scalingFactor = await getScale(getPaths("SYS").packIconsPath);
        setValue("scalingFactor", scalingFactor, "insert");

        setValue("upscaleRate", upscaleRate, "insert");
        setValue("xpPercent", xpPercent, "insert");
    } catch (err) {
        throw new Error("Error while initialising: " + err);
    }
}

// Returns the buffer of the UI
export default async function main(
    packName: string,
    packZipBuffer: Buffer,
    upscaleRate: number,
    xpPercent: number
) {
    // Initialise Config && Paths.
    await initialize(packName, packZipBuffer, upscaleRate, xpPercent);

    // Get system paths for saving.
    const systemPaths = getPaths("SYS");

    // Fix differing image sizes. (incase of any)
    try {
        await imageDimsFix(
            systemPaths.packIconsPath,
            systemPaths.packWidgetsPath
        );
    } catch (err) {
        throw new Error(err as string);
    }

    // Crop all the sprites from icons.png
    await crop("ICON");
    // Crop all the sprites from gui.png / widgets.png
    await crop("GUI");

    // Process the whole image with the cutouts.
    const uiImageBuffer = await processImage();

    // clean up extra files
    clean([systemPaths.tempPath, configPath]);

    return uiImageBuffer;
}
