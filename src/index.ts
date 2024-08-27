import ps from "prompt-sync";
import fs from "fs";
import make from "./ui-maker.js";

const prompt = ps();

const packPath = prompt(
    "Drag your pack onto the window. (or) Paste its path here: "
);
if (!fs.existsSync(packPath)) {
    console.log("Invalid Path!");
    process.exit(1);
}

let xpPercentPrompt = prompt(
    "How much do you want the XP bar to be filled (in %)?\n(sometimes it won't work, try again if that happens): "
);

let xpPercent = parseInt(xpPercentPrompt);
if (isNaN(xpPercent) || xpPercent < 1 || xpPercent > 100) {
    console.log("Invalid XP fill value! It must be between 1 and 100.");
    process.exit(1);
}

xpPercent = xpPercent / 100;

const upscaleRate = parseInt(
    prompt("How much upscaling do you want on the image (1 - 10): ")
);
if (isNaN(upscaleRate) || upscaleRate < 1 || upscaleRate > 10) {
    console.log("Invalid upscaling rate! It must be between 1 and 10.");
    process.exit(1);
}

(async () => {
    const savePath = await make(packPath, upscaleRate, xpPercent);

    console.log(`Saved the generated UI at: ${savePath}`);
    process.exit(0);
})();
