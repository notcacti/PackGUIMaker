import { ICoordinatesType, IIconInfo } from "../types.js";
import { getPaths } from "./paths.js";
import {
    combineIcons,
    cropIcon,
    repeatIcon,
    savePngBuffer,
    upscaleImage,
} from "../utils/imageUtils.js";
import { getCoordinates, getDestinationCoordinates } from "./coordinates.js";
import { loadImage } from "@napi-rs/canvas";
import { getConfig } from "../utils/configUtils.js";

export async function crop(type: ICoordinatesType) {
    const systemPaths = getPaths("SYS");
    const imagePaths = getPaths(type);

    const imageCoordinates = getCoordinates(type);

    const spriteSheetPath =
        type === "ICON"
            ? systemPaths.packIconsPath
            : type === "GUI"
            ? systemPaths.packWidgetsPath
            : undefined;

    if (!spriteSheetPath) {
        throw new Error("Invalid Type: " + type);
    }

    const imagePathEntries = Object.entries(imagePaths);
    const imageCoordinateEntries = Object.entries(imageCoordinates);

    for (let i = 0; i < imagePathEntries.length; i++) {
        const [_, path] = imagePathEntries[i];
        const [__, coordinates] = imageCoordinateEntries[i];

        try {
            cropIcon(
                spriteSheetPath,
                path,
                coordinates.x,
                coordinates.y,
                coordinates.width,
                coordinates.height
            );
        } catch (err) {
            console.error(err);
            continue;
        }
    }

    return;
}

// returns the combined image buffer;
async function combine() {
    try {
        const iconsInfo = generateIconInfo("ICON");
        const guiInfo = generateIconInfo("GUI");

        const repeatImageKeys = ["heart", "armor", "hunger"];

        for (const iconInfo of iconsInfo) {
            if (repeatImageKeys.includes(iconInfo.name)) {
                const iconBuffer = await repeatIcon(iconInfo.path, 3);
                iconInfo.path = iconBuffer;
            }
        }

        const iconsCanvas = await combineIcons(iconsInfo);
        const guiCanvas = await combineIcons(guiInfo);

        const finalIconsInfo: IIconInfo = {
            name: "iconspng",
            path: iconsCanvas.toBuffer("image/png"),
            destCoordinates: {
                x: 0,
                y: 0,
                width: iconsCanvas.width,
                height: iconsCanvas.height,
            },
        };

        const finalGuiInfo: IIconInfo = {
            name: "guipng",
            path: guiCanvas.toBuffer("image/png"),
            destCoordinates: {
                x: 0,
                y: iconsCanvas.height,
                width: guiCanvas.width,
                height: guiCanvas.height,
            },
        };

        const finalUiCanvas = await combineIcons([
            finalIconsInfo,
            finalGuiInfo,
        ]);

        return finalUiCanvas.toBuffer("image/png");
    } catch (error) {
        console.error("Error in combine function:", error);
        return;
    }
}

function generateIconInfo<T extends ICoordinatesType>(type: T) {
    const imagePaths = getPaths(type);

    const destinationCoordinates = getDestinationCoordinates(type);

    const imagePathEntries = Object.entries(imagePaths);
    const imageCoordinateEntries = Object.entries(destinationCoordinates);

    const iconsInfo: IIconInfo[] = [];

    for (let i = 0; i < imagePathEntries.length; i++) {
        const [_, path] = imagePathEntries[i];
        const [name, coordinates] = imageCoordinateEntries[i];

        const icon: IIconInfo = {
            name: name,
            path: path,
            destCoordinates: {
                x: coordinates.x,
                y: coordinates.y,
                width: coordinates.width,
                height: coordinates.height,
            },
        };

        iconsInfo.push(icon);
    }

    return iconsInfo;
}

// just runs combine() and then upscales.
// returns buffer of final ui image
export async function processImage() {
    const uiBuffer = await combine();
    const upscaleRate = getUpscaleRate();

    let finalImageBuffer: Buffer = Buffer.from("");
    if (upscaleRate > 1) {
        finalImageBuffer = await upscaleImage(uiBuffer, 10);
    } else {
        finalImageBuffer = uiBuffer;
    }

    return finalImageBuffer;
}

function getUpscaleRate() {
    try {
        const config = getConfig();
        const upscaleRate = config.upscaleRate;

        return upscaleRate;
    } catch (err) {
        // Handle error from getConfig()
        console.error("Error fetching config: ", err);
        process.exit(1);
    }
}

export async function imageDimsFix(iconsPath: string, widgetsPath: string) {
    const widgetsDims = {
        width: (await loadImage(widgetsPath)).width,
        height: (await loadImage(widgetsPath)).height,
    };

    const iconsDims = {
        width: (await loadImage(iconsPath)).width,
        height: (await loadImage(iconsPath)).height,
    };

    // Only comparing widths as they are always a squared image.
    if (widgetsDims.width === iconsDims.width) {
        return;
    } else if (widgetsDims.width < iconsDims.width) {
        const imageBuffer = await upscaleImage(
            widgetsPath,
            ~~(iconsDims.width / widgetsDims.width)
        );
        savePngBuffer(imageBuffer, widgetsPath);
    } else if (iconsDims.width < widgetsDims.width) {
        const imageBuffer = await upscaleImage(
            iconsPath,
            ~~(widgetsDims.width / iconsDims.width)
        );
        savePngBuffer(imageBuffer, iconsPath);
    } else {
        throw new Error(
            `Error while fixing dimentions.\nWidgetsWidth = ${widgetsDims.width}\nIconsWidth = ${iconsDims.width}`
        );
    }
}
