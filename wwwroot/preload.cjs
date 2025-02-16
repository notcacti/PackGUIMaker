const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
    generateUI: ({ packName, packBufferString, xpPercent, upscaleRate }) =>
        ipcRenderer.invoke("generate-ui", {
            packName,
            packBufferString,
            xpPercent,
            upscaleRate,
        }),
});
