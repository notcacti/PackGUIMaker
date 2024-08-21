import path from "path";
import fs from "fs";
import { IPaths, IPathType } from "../types.js";

export function getPath(
    type: IPathType,
    bedrock?: boolean,
    packFileName?: string
) {
    // const xpNotFullValPercent = 51 / 100; // DON'T USE 100% IT WILL 100% BREAK
    // const upscale = true;
    // const upscaleRate = 10;

    const tempPath = path.join(process.cwd(), "temp");
    let packSavePath = path.join(tempPath, packFileName);

    const guiFolderPath = bedrock
        ? path.join(packSavePath, "textures", "gui")
        : path.join(packSavePath, "assets", "minecraft", "textures", "gui");
    const iconsPath = path.join(guiFolderPath, "icons.png");
    const widgetsPath = bedrock
        ? path.join(guiFolderPath, "gui.png")
        : path.join(guiFolderPath, "widgets.png");

    const iconsSavePath = path.join(tempPath, "icons");
    const widgetsSavePath = path.join(tempPath, "widgets");

    // Remove while developing app.
    const uiSavePath = path.join(process.cwd(), "UIs");

    const sysPaths: IPaths<"SYS"> = {
        tempPath: tempPath,
        packFolder: packSavePath,
        packGuiFolder: guiFolderPath,
        packIconsFolder: iconsPath,
        packWidgetsPath: widgetsPath,
        tempIconsPath: iconsSavePath,
        tempWidgetsPath: widgetsSavePath,
        // Remove while developing app.
        uiSavePath: uiSavePath,
    };

    const iconsPaths: IPaths<"ICON"> = {
        hunger: path.join(iconsSavePath, "hunger.png"),
        hungerBg: path.join(iconsSavePath, "hungerBg.png"),
        heart: path.join(iconsSavePath, "heart.png"),
        heartBg: path.join(iconsSavePath, "heartBg.png"),
        xpEmpty: path.join(iconsSavePath, "xpEmpty.png"),
        xp: path.join(iconsSavePath, "xp.png"),
        armor: path.join(iconsSavePath, "armor.png"),
    };

    const guiPaths: IPaths<"GUI"> = {
        twoSlots: path.join(widgetsSavePath, "firstTwoSlots.png"),
        lastSlot: path.join(widgetsSavePath, "lastSlot.png"),
        selector: path.join(widgetsSavePath, "selector.png"),
        gui: path.join(widgetsSavePath, "gui.png"),

        // Remove while developing app.
        uiImg: path.join(uiSavePath, `${packFileName}_ui.png`),
    };

    switch (type) {
        case "SYS":
            return sysPaths;
        case "ICON":
            return iconsPaths;
        case "GUI":
            return guiPaths;
        default:
            throw new Error("-- [?!] Impossible..~ --");
    }
}

// This function checks if the "bedrock" && "packFileName" already exists in the config.
// If so, it returns them. If not, it returns undefined.
// If it's undefined then the caller would have to provide the file path or getPath() will throw an error.
function checkConfig() {}
