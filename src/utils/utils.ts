import fs from "fs";
import unzipper from "unzipper";
import path from "path";
import { loadImage } from "@napi-rs/canvas";
import { Readable } from "stream";

export function unzipFile(
    zipFileBuffer: Buffer,
    outputDir: string
): Promise<void> {
    return new Promise((resolve, reject) => {
        const bufferStream = new Readable();
        bufferStream.push(zipFileBuffer);
        bufferStream.push(null); // End of stream indicator.

        // Pipe the readable stream to unzipper.
        bufferStream
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
    for (const pth of paths) {
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
    let bedrock: boolean = false;

    if (!fs.existsSync(packPath))
        throw new Error("Path does not exist: " + packPath);
    if (!fs.lstatSync(packPath).isDirectory())
        throw new Error("Path is not a directory: " + packPath);

    if (
        packPath.split(".").pop() === "mcpack" &&
        fs.readdirSync(packPath).includes("manifest.json")
    ) {
        bedrock = true;
    }

    try {
        let subfiles = fs.readdirSync(packPath);

        if (subfiles.length <= 1) packPath = path.join(packPath, subfiles[0]);

        if (fs.readdirSync(packPath).includes("manifest.json")) bedrock = true;
    } catch (err) {
        throw new Error("Error while reading directory: " + err);
    }

    return bedrock;
}

export function convertBedrock(parentDir: string) {
    if (!fs.existsSync(parentDir)) {
        console.error(`Source directory does not exist: ${parentDir}`);
        return;
    }

    // Get the list of files and directories in the parent directory
    const subfiles = fs.readdirSync(parentDir);

    // Check if there's exactly one subfolder
    if (subfiles.length === 1) {
        const subfolder = path.join(parentDir, subfiles[0]);

        // Ensure the single item is a directory
        if (fs.statSync(subfolder).isDirectory()) {
            const subfolderContents = fs.readdirSync(subfolder);

            // Move each item from the subfolder to the parent directory
            for (const item of subfolderContents) {
                const itemPath = path.join(subfolder, item);
                const targetPath = path.join(parentDir, item);

                try {
                    fs.renameSync(itemPath, targetPath);
                } catch (error) {
                    console.error(
                        `Error moving ${itemPath} to ${targetPath}:`,
                        error
                    );
                }
            }

            // Optionally remove the now-empty subfolder
            try {
                fs.rmdirSync(subfolder);
            } catch (error: any) {
                if (error.split(" ")[0] === "ENOTEMPTY") {
                    console.warn(
                        `Directory not empty after moving contents: ${subfolder}`
                    );
                } else {
                    console.error(
                        `Error removing directory ${subfolder}:`,
                        error
                    );
                }
            }
        } else {
            console.error(
                `The only item in the directory is not a folder: ${subfolder}`
            );
        }
    }
    return;
}
