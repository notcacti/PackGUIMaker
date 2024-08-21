import fs from "fs";
import path from "path";

// Path to "temp" folder
// returns path to the config file.
export function createConfig(tempPath: string) {
    if (!fs.existsSync(tempPath))
        throw new Error("Path does not exist: " + tempPath);
    if (!fs.lstatSync(tempPath).isDirectory())
        throw new Error("Path is not a directory: " + tempPath);

    const configPath = path.join(tempPath, "config.json");

    try {
        fs.writeFileSync(configPath, JSON.stringify({}));
    } catch (err) {
        throw new Error("Error while creating config: " + err);
    }

    return configPath;
}

// Including "config.json";
// returns config.json's contents
export function getConfig(configPath: string) {
    if (!fs.existsSync(configPath))
        throw new Error("Path does not exist: " + configPath);
    if (!fs.lstatSync(configPath).isFile())
        throw new Error("Path is not a file: " + configPath);

    const configJson = JSON.parse(fs.readFileSync(configPath).toString());

    return configJson;
}

// TODO:
// Add key and Del key also.
// Modify key also to be added.
