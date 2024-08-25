import { ICoordinatesType, IIconInfo } from "../types.js";
import { getPaths } from "./paths.js";
import { combineIcons, cropIcon, repeatIcon } from "../utils/imageUtils.js";
import { getCoordinates, getDestinationCoordinates } from "./coordinates.js";

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

// Combines a type of image.
// export async function combine(type: ICoordinatesType) {
//     const systemPaths = getPaths("SYS");
//     const imagePaths = getPaths(type);

//     const destinationCoordinates = getDestinationCoordinates(type);

//     const imagePathEntries = Object.entries(imagePaths);
//     const imageCoordinateEntries = Object.entries(destinationCoordinates);

//     const icons: IIconInfo[] = [];

//     for (let i = 0; i < imagePathEntries.length; i++) {
//         const [_, path] = imagePathEntries[i];
//         const [__, coordinates] = imageCoordinateEntries[i];

//         const icon: IIconInfo = {
//             path: path,
//             destCoordinates: {
//                 x: coordinates.x,
//                 y: coordinates.y,
//                 width: coordinates.width,
//                 height: coordinates.height,
//             },
//         };

//         icons.push(icon);
//     }

//     switch (type) {
//         case "ICON": {
//             combineIcons(icons, systemPaths.processedIconsPath);
//             return;
//         }
//         case "GUI": {
//             combineIcons(icons, systemPaths.processedWidgetsPath);
//             return;
//         }
//         default: {
//             throw new Error("Invalid Parameters!");
//         }
//     }
// }

// Combines only 2 images (i.e. gui and icons processed);
// export async function combineUi() {
//     const paths = getPaths("SYS");
//     const icons = paths.processedIconsPath;
//     const widgets = paths.processedWidgetsPath;

//     const iconsInfo: IIconInfo = {
//         path
//     };

//     const widgetsInfo: IIconInfo = {

//     };

//     const imageInfo = [iconsInfo, widgetsInfo];

//     combineIcons(imageInfo, paths.uiSavePath);
// }

export async function combine(outputPath: string) {
    // const
}
