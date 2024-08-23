import fs from "fs";
import path from "path";

let configPath: string | null = null;

// Path to "temp" folder
// returns path to the config file.
export function createConfig(tempPath: string) {
    if (!fs.existsSync(tempPath))
        throw new Error("Path does not exist: " + tempPath);
    if (!fs.lstatSync(tempPath).isDirectory())
        throw new Error("Path is not a directory: " + tempPath);

    configPath = path.join(tempPath, "config.json");

    try {
        fs.writeFileSync(configPath, JSON.stringify({}));
    } catch (err) {
        throw new Error("Error while creating config: " + err);
    }

    return configPath;
}

// returns config.json's contents
export function getConfig() {
    if (!configPath)
        throw new Error(
            "NOTINIT Configuration has not been initialized. Call createConfig() first."
        );
    if (!fs.existsSync(configPath))
        throw new Error("Path does not exist: " + configPath);
    if (!fs.lstatSync(configPath).isFile())
        throw new Error("Path is not a file: " + configPath);

    const configJson = JSON.parse(fs.readFileSync(configPath).toString());

    return configJson;
}

export function setValue(
    key: string,
    value: string,
    mode: "insert" | "modify" = "insert"
) {
    if (!configPath)
        throw new Error(
            "NOTINIT Configuration has not been initialized. Call createConfig() first."
        );
    if (!fs.existsSync(configPath))
        throw new Error("Path does not exist: " + configPath);
    if (!fs.lstatSync(configPath).isFile())
        throw new Error("Path is not a file: " + configPath);

    let configJson = JSON.parse(fs.readFileSync(configPath).toString());

    if (mode === "insert" && key in configJson) {
        throw new Error(
            `Key "${key}" already exists. Use modifyValue to update it.`
        );
    } else if (mode === "modify" && !(key in configJson)) {
        throw new Error(
            `Key "${key}" does not exist. Use insertValue to add it.`
        );
    }

    configJson[key] = value;

    try {
        fs.writeFileSync(configPath, JSON.stringify(configJson));
    } catch (err) {
        throw new Error("Failed to set value: " + err);
    }
}

export function deleteValue(key: string) {
    if (!configPath)
        throw new Error(
            "NOTINIT Configuration has not been initialized. Call createConfig() first."
        );
    if (!fs.existsSync(configPath))
        throw new Error("Path does not exist: " + configPath);
    if (!fs.lstatSync(configPath).isFile())
        throw new Error("Path is not a file: " + configPath);

    if (!key) {
        throw new Error("Invalid Parameters!");
    }

    let configJson: Record<string, string> = JSON.parse(
        fs.readFileSync(configPath).toString()
    );

    if (!(key in configJson)) {
        throw new Error(`Key "${key}" does not exist in the configuration.`);
    }

    const { [key]: _, ...newConfigJson } = configJson;

    try {
        fs.writeFileSync(configPath, JSON.stringify(newConfigJson));
    } catch (err) {
        throw new Error("Failed to delete value: " + err);
    }
}
