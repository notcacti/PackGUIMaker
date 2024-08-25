import path from "path";
import { IPaths, IPathType } from "../types.js";
import { getConfig } from "../utils/configUtils.js";
import { configPath } from "../index.js";
import { checkAndMkdir } from "../utils/utils.js";

export function getPaths<T extends IPathType>(type: T): IPaths<T> {
    const configValues = getConfigValues();
    if (!configValues) {
        console.error("Couldn't fetch config - paths. Terminating.");
        process.exit(1);
    }

    let { bedrock, packFileName } = configValues;

    const tempPath = path.join(process.cwd(), "temp");
    let packSavePath = path.join(tempPath, packFileName ?? "pack");

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

    const _configPath = configPath;

    const sysPaths: IPaths<"SYS"> = {
        tempPath: tempPath,
        packFolder: packSavePath,
        packGuiFolder: guiFolderPath,
        packIconsPath: iconsPath,
        packWidgetsPath: widgetsPath,
        tempIconsPath: iconsSavePath,
        tempWidgetsPath: widgetsSavePath,
        configPath: _configPath,
        // Remove while developing app.
        uiSavePath: uiSavePath,
    };

    if (type === "SYS") return sysPaths as IPaths<T>;

    const iconsPaths: IPaths<"ICON"> = {
        hunger: path.join(iconsSavePath, "hunger.png"),
        hungerBg: path.join(iconsSavePath, "hungerBg.png"),
        heart: path.join(iconsSavePath, "heart.png"),
        heartBg: path.join(iconsSavePath, "heartBg.png"),
        xpEmpty: path.join(iconsSavePath, "xpEmpty.png"),
        xp: path.join(iconsSavePath, "xp.png"),
        armor: path.join(iconsSavePath, "armor.png"),
    };

    if (type === "ICON") return iconsPaths as IPaths<T>;

    const guiPaths: IPaths<"GUI"> = {
        twoSlots: path.join(widgetsSavePath, "firstTwoSlots.png"),
        lastSlot: path.join(widgetsSavePath, "lastSlot.png"),
        selector: path.join(widgetsSavePath, "selector.png"),
        gui: path.join(widgetsSavePath, "gui.png"),

        // Remove while developing app.
        uiImg: path.join(uiSavePath, `${packFileName}_ui.png`),
    };

    if (type === "GUI") return guiPaths as IPaths<T>;

    throw new Error(`Invalid type: ${type}`);
}

// This function checks if the "bedrock" && "packFileName" already exists in the config.
// If so, it returns them. If not, it returns undefined.
// If it's undefined then the caller would have to provide the file path or getPath() will throw an error.
function getConfigValues() {
    try {
        const config = getConfig();
        const bedrock = config.bedrock;
        const packFileName = config.packFileName;

        return { bedrock, packFileName };
    } catch (err) {
        // Handle error from getConfig()
        console.error("Error fetching config: ", err);
        return undefined;
    }
}

// Create all the directories mentioned in getPaths();
export function initializePaths(paths: IPaths<"SYS">) {
    for (const path in paths) {
        if (!path) continue;
        try {
            checkAndMkdir(path);
        } catch (err) {
            console.error("Error while initialising paths: " + err);
        }
    }
}
