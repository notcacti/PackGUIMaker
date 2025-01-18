import { app, BrowserWindow, Menu } from "electron";
import { startServer } from "./server.js";

let mainWindow: BrowserWindow | null;

function createWindow(port: number) {
    mainWindow = new BrowserWindow({
        width: 1500,
        height: 1000,
        title: "Cacti's GUI Maker",
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
        frame: true,
    });

    mainWindow.loadURL(`http://localhost:${port}`);

    Menu.setApplicationMenu(null);

    mainWindow.on("closed", () => {
        mainWindow = null;
    });
}

app.on("ready", () => {
    startServer()
        .then((port) => {
            createWindow(port);
        })
        .catch((err) => {
            console.error(`Failed to start server: ${err}`);

            if (process.platform !== "darwin") {
                app.quit();
            }
        });
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});
