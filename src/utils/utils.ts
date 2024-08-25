import fs from "fs";
import unzipper from "unzipper";
import path from "path";
import { loadImage } from "@napi-rs/canvas";

export function unzipFile(zipFilePath: string, outputDir: string) {
    return new Promise<void | Error>((resolve, reject) => {
        fs.createReadStream(zipFilePath)
            .pipe(unzipper.Extract({ path: outputDir }))
            .on("close", () => {
                resolve();
            })
            .on("error", (err) => {
                reject(err);
            });
    });
}

export function clean(paths: string[]) {
    for (const pth in paths) {
        if (!fs.existsSync(pth)) continue;
        fs.rmSync(pth, { recursive: true, force: true });
    }

    return;
}

export async function getScale(spriteSheetPath: string) {
    if (!fs.existsSync(spriteSheetPath))
        throw new Error("Path does not exist: " + spriteSheetPath);
    return ~~((await loadImage(spriteSheetPath)).height / 256);
}

/* 
    This function is used for checking if a folder exists.
    If not, it makes the folder.
    If it does exist it does nothing.
    returns an error if the path provided is not a folder or doesn't exist.
*/
export function checkAndMkdir(folderPath: string) {
    if (fs.existsSync(folderPath)) return;

    try {
        fs.mkdirSync(folderPath);
    } catch (err) {
        throw new Error("Error while creating directory: " + err);
    }

    return;
}

// Only give the unzipped folder path.
export function checkBedrock(packPath: string) {
    let bedrockPack: boolean = false;

    if (!fs.existsSync(packPath))
        throw new Error("Path does not exist: " + packPath);
    if (!fs.lstatSync(packPath).isDirectory())
        throw new Error("Path is not a directory: " + packPath);

    if (
        packPath.split(".").pop() === "mcpack" &&
        fs.readdirSync(packPath).includes("manifest.json")
    ) {
        bedrockPack = true;
    }

    try {
        let subfiles = fs.readdirSync(packPath);

        if (subfiles.length <= 1) packPath = path.join(packPath, subfiles[0]);

        if (fs.readdirSync(packPath).includes("manifest.json"))
            bedrockPack = true;
    } catch (err) {
        throw new Error("Error while reading directory: " + err);
    }

    return bedrockPack;
}
