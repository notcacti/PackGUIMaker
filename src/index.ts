import { app, dialog, ipcMain, Menu, BrowserWindow } from "electron";
import path from "path";
import { IPackData } from "./types.js";
import make from "./app/src.js";
import { writeFileSync } from "fs";

let mainWindow: BrowserWindow | null;
const resourcesPath: string = process.resourcesPath;

app.on("ready", () => {
    mainWindow = new BrowserWindow({
        width: 1500,
        height: 1000,
        title: "Cacti's GUI Maker",
        autoHideMenuBar: true,
        fullscreen: false,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            devTools: false,
            preload: path.join(resourcesPath, "wwwroot", "preload.cjs"),
        },
    });

    Menu.setApplicationMenu(null);

    mainWindow
        .loadFile(path.join(resourcesPath, "wwwroot", "index.html"))
        .catch((err) => {
            console.error("Failed to load the application: ", err);
        });

    mainWindow.on("closed", () => {
        mainWindow = null;
    });
});

ipcMain.handle("generate-ui", async (_event, data: IPackData | undefined) => {
    const { packName, packBufferString, xpPercent, upscaleRate } = data;

    const packBuffer: Buffer = Buffer.from(packBufferString, "base64");

    // Error checks.
    if (Number.isNaN(xpPercent)) {
        dialog.showErrorBox("Error ❌", "XP Fill Value is invalid!");
        return { success: false };
    }

    if (Number.isNaN(upscaleRate)) {
        dialog.showErrorBox("Error ❌", "Upscaling Value is invalid!");
        return { success: false };
    }

    if (!packName || !packBuffer) {
        dialog.showErrorBox("Error ❌", "Invalid pack uploaded!");
        return { success: false };
    }

    if (!xpPercent || !upscaleRate) {
        dialog.showErrorBox(
            "Impossible Error⁉️ ❌",
            "If you get this error contact 'notcacti' on discord."
        );
        return { success: false };
    }

    if (!packName.endsWith(".zip") && !packName.endsWith(".mcpack")) {
        dialog.showErrorBox(
            "Error ❌",
            "You've uploaded an invalid pack. Upload a .zip file for java packs and .mcpack files for bedrock packs."
        );
        return { success: false };
    }
    if (upscaleRate <= 0 && upscaleRate >= 11) {
        dialog.showErrorBox(
            "Impossible Error ❌",
            "If you get this error contact 'notcacti' on discord (UC)."
        );
        return { success: false };
    }

    if (xpPercent <= 0 && xpPercent >= 1) {
        dialog.showErrorBox(
            "Impossible Error ❌",
            "If you get this error contact 'notcacti' on discord (XP)."
        );
        return { success: false };
    }

    try {
        const imgBuffer = await make(
            packName,
            packBuffer,
            upscaleRate,
            xpPercent
        );

        const { filePath } = await dialog.showSaveDialog({
            title: "Save UI",
            defaultPath: `${packName}_ui.png`,
            filters: [{ name: "PNG Image", extensions: ["png"] }],
        });

        if (!filePath) return { success: false, message: "Save canceled" };

        writeFileSync(filePath, imgBuffer);
        return { success: true };
    } catch (err) {
        dialog.showErrorBox("Image Error ❌", err.toString());
        return { success: false, message: err };
    }
});

// Currently useless code as MacOS isn't supported
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});
