import fs from "fs";
import { IConfig } from "../types.js";
import path from "path";

export const configPath = path.join(process.cwd(), "config.json");

// Path to "temp" folder
// returns path to the config file.
export function createConfig() {
    if (fs.existsSync(configPath)) fs.rmSync(configPath);

    try {
        fs.writeFileSync(configPath, JSON.stringify({}));
    } catch (err) {
        throw new Error("Error while creating config: " + err);
    }

    return configPath;
}

// returns config.json's contents
export function getConfig(): IConfig {
    if (!configPath) return null;
    if (!fs.existsSync(configPath))
        throw new Error("Path does not exist: " + configPath);
    if (!fs.lstatSync(configPath).isFile())
        throw new Error("Path is not a file: " + configPath);

    const configJson = JSON.parse(fs.readFileSync(configPath).toString());

    return configJson;
}

export function setValue(
    key: string,
    value: any,
    mode: "insert" | "modify" = "insert"
): void | null {
    if (!configPath)
        throw new Error("Error while setting value: configPath non-existent");
    if (!fs.existsSync(configPath))
        throw new Error("Path does not exist: " + configPath);
    if (!fs.lstatSync(configPath).isFile())
        throw new Error("Path is not a file: " + configPath);

    let configJson = JSON.parse(fs.readFileSync(configPath).toString());

    if (mode === "insert" && key in configJson) {
        throw new Error(
            `Key "${key}" already exists. Use "modify" mode to update it.`
        );
    } else if (mode === "modify" && !(key in configJson)) {
        throw new Error(
            `Key "${key}" does not exist. Use "insert" mode to add it.`
        );
    }

    configJson[key] = value;

    try {
        fs.writeFileSync(configPath, JSON.stringify(configJson));
    } catch (err) {
        throw new Error("Failed to set value: " + err);
    }

    return;
}

export function deleteValue(key: string): void | null {
    if (!configPath) return null;
    if (!fs.existsSync(configPath))
        throw new Error("Path does not exist: " + configPath);
    if (!fs.lstatSync(configPath).isFile())
        throw new Error("Path is not a file: " + configPath);

    if (!key) {
        throw new Error("Invalid Parameters!");
    }

    let configJson: Record<string, any> = JSON.parse(
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

    return;
}
