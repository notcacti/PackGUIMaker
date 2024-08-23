import { ICoordinatesType, IIconInfo } from "../types.js";
import { getPaths } from "./paths.js";
import { combineIcons, cropIcon } from "../utils/imageUtils.js";
import { getCoordinates } from "./coordinates.js";

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

        cropIcon(
            spriteSheetPath,
            path,
            coordinates.x,
            coordinates.y,
            coordinates.width,
            coordinates.height
        );
    }

    return;
}

export async function combine(type: ICoordinatesType) {
    const systemPaths = getPaths("SYS");
    const imagePaths = getPaths(type);

    const imageCoordinates = getCoordinates(type);

    const imagePathEntries = Object.entries(imagePaths);
    const imageCoordinateEntries = Object.entries(imageCoordinates);

    const icons: IIconInfo[] = [];

    for (let i = 0; i < imagePathEntries.length; i++) {
        const [_, path] = imagePathEntries[i];
        const [__, coordinates] = imageCoordinateEntries[i];

        const icon: IIconInfo = {
            path: path,
            destCoordinates: {
                x: coordinates.x,
                y: coordinates.y,
                width: coordinates.width,
                height: coordinates.height,
            },
        };

        icons.push(icon);
    }

    combineIcons(icons, systemPaths.uiSavePath);
}
