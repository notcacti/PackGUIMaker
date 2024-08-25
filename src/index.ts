import { createConfig, setValue } from "./utils/configUtils.js";
import { getPaths, initializePaths } from "./helpers/paths.js";
import { checkBedrock, getScale, unzipFile } from "./utils/utils.js";
import path from "path";
import { crop, imageDimsFix, processImage } from "./helpers/imageProcessing.js";
import { savePngBuffer } from "./utils/imageUtils.js";

export const configPath = path.join(process.cwd(), "config.json");

async function main() {
    // Variables that would be auto-generated.
    const packZipPath = path.join(process.cwd(), "__mocks__", "pack.zip");
    const upscaleRate = 10;
    const xpPercent = 50 / 100;

    // Initialise Config && Paths.
    initialize(packZipPath, upscaleRate, xpPercent);

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
    savePngBuffer(uiImageBuffer, systemPaths.uiSavePath);

    /* ---- fin. ---- */
    process.exit(0);
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
        process.exit(1);
    }
}
