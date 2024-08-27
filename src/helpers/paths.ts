import path from "path";
import { IPaths, IPathType } from "../types.js";
import { getConfig } from "../utils/configUtils.js";
import { configPath } from "../utils/configUtils.js";
import { checkAndMkdir } from "../utils/utils.js";

export function getPaths<T extends IPathType>(type: T): IPaths<T> {
    const configValues = getConfigValues();
    if (!configValues) {
        console.error("Couldn't fetch config - paths. Terminating.");
        process.exit(1);
    }

    let { bedrock, packFileName } = configValues;

    const tempPath = path.join(process.cwd(), "temp");
    let packSavePath = path.join(tempPath, packFileName);

    const guiFolderPath =
        bedrock === true
            ? path.join(packSavePath, "textures", "gui")
            : bedrock === false
            ? path.join(packSavePath, "assets", "minecraft", "textures", "gui")
            : bedrock === undefined
            ? ""
            : "";
    const iconsPath = path.join(guiFolderPath, "icons.png");
    const widgetsPath =
        bedrock === true
            ? path.join(guiFolderPath, "gui.png")
            : bedrock === false
            ? path.join(guiFolderPath, "widgets.png")
            : bedrock === undefined
            ? ""
            : "";

    const iconsSavePath = path.join(tempPath, "icons");
    const widgetsSavePath = path.join(tempPath, "widgets");

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
    };

    if (type === "SYS") return sysPaths as IPaths<T>;

    const iconsPaths: IPaths<"ICON"> = {
        xpBg: path.join(iconsSavePath, "xpBg.png"),
        hungerBg: path.join(iconsSavePath, "hungerBg.png"),
        heartBg: path.join(iconsSavePath, "heartBg.png"),
        xp: path.join(iconsSavePath, "xp.png"),
        hunger: path.join(iconsSavePath, "hunger.png"),
        heart: path.join(iconsSavePath, "heart.png"),
        armor: path.join(iconsSavePath, "armor.png"),
    };

    if (type === "ICON") return iconsPaths as IPaths<T>;

    const guiPaths: IPaths<"GUI"> = {
        twoSlots: path.join(widgetsSavePath, "firstTwoSlots.png"),
        lastSlot: path.join(widgetsSavePath, "lastSlot.png"),
        selector: path.join(widgetsSavePath, "selector.png"),
    };

    if (type === "GUI") return guiPaths as IPaths<T>;

    throw new Error(`Invalid type: ${type}`);
}

// This function checks if the "bedrock" && "packFileName" already exists in the config.
// If so, it returns them. If not, it returns undefined.
// If configPath is undefined then the caller would have to provide the file path or getPath() will throw an error.
function getConfigValues() {
    try {
        const config = getConfig();
        const bedrock = config.bedrock ?? undefined;
        const packFileName = config.packFileName ?? undefined;

        return { bedrock, packFileName };
    } catch (err) {
        // Handle error from getConfig()
        console.error("Error fetching config: ", err);
        return undefined;
    }
}

// Create all the directories mentioned in getPaths();
export function initializePaths(paths: IPaths<"SYS">) {
    for (const pth in paths) {
        if (paths[pth as keyof typeof paths] === undefined) continue;
        try {
            checkAndMkdir(paths[pth as keyof typeof paths]);
        } catch (err) {
            console.error("Error while initialising paths: " + err);
        }
    }
}
