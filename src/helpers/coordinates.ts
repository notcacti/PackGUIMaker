import { ICoordinates, ICoordinatesType } from "../types.js";
import { getConfig } from "../utils/configUtils.js";

export function getCoordinates<T extends ICoordinatesType>(
    type: T
): ICoordinates<T> {
    const configValues = getConfigValues();
    if (!configValues) {
        console.error("Couldn't fetch config - coordinates. Terminating.");
        process.exit(1);
    }

    const { scalingFactor, xpPercent } = configValues;

    const guiCoordinates: ICoordinates<"GUI"> = {
        twoSlots: {
            x: 1,
            y: 1,
            width: 40 * scalingFactor,
            height: 20 * scalingFactor,
        },
        lastSlot: {
            x: 161 * scalingFactor,
            y: 1,
            width: 20 * scalingFactor,
            height: 20 * scalingFactor,
        },
        selector: {
            x: 1 * scalingFactor,
            y: 23 * scalingFactor,
            width: 22 * scalingFactor,
            height: 22 * scalingFactor,
        },
    };

    const xpAdjustmentFactor =
        guiCoordinates.twoSlots.width + guiCoordinates.lastSlot.width;

    const iconCoordinates: ICoordinates<"ICON"> = {
        xpBg: {
            x: 182 * scalingFactor - xpAdjustmentFactor,
            y: 64 * scalingFactor,
            width: xpAdjustmentFactor,
            height: 5 * scalingFactor,
        },
        hungerBg: {
            x: 16 * scalingFactor,
            y: 27 * scalingFactor,
            width: 9 * scalingFactor,
            height: 9 * scalingFactor,
        },
        heartBg: {
            x: 16 * scalingFactor,
            y: 0 * scalingFactor,
            width: 9 * scalingFactor,
            height: 9 * scalingFactor,
        },
        xp: {
            x: 0 * scalingFactor,
            y: 69 * scalingFactor,
            width: xpAdjustmentFactor * xpPercent,
            height: 5 * scalingFactor,
        },
        hunger: {
            x: 52 * scalingFactor,
            y: 27 * scalingFactor,
            width: 9 * scalingFactor,
            height: 9 * scalingFactor,
        },
        heart: {
            x: 52 * scalingFactor,
            y: 0 * scalingFactor,
            width: 9 * scalingFactor,
            height: 9 * scalingFactor,
        },
        armor: {
            x: 34 * scalingFactor,
            y: 9 * scalingFactor,
            width: 9 * scalingFactor,
            height: 9 * scalingFactor,
        },
    };

    switch (type) {
        case "ICON": {
            return iconCoordinates as ICoordinates<T>;
        }
        case "GUI": {
            return guiCoordinates as ICoordinates<T>;
        }
        default: {
            throw new Error(`Invalid type: ${type}`);
        }
    }
}

export function getDestinationCoordinates<T extends ICoordinatesType>(
    type: T
): ICoordinates<T> {
    const configValues = getConfigValues();
    if (!configValues) {
        console.error("Couldn't fetch config - coordinates. Terminating.");
        process.exit(1);
    }

    const { scalingFactor, xpPercent } = configValues;

    // Define xpHeight
    const xpBarHeight = 5 * scalingFactor;

    // Calculate y positions relative to the bottom of the canvas (check prev commit(416e8d2) to see how it was handled before)
    const bottomOffset = (offset: number) => (22 - offset) * scalingFactor;

    // GUI coordinates
    const twoSlots = {
        x: 0,
        y: bottomOffset(20 + 1), // offset for y-position based on scalingFactor (20px for it's height and 1px to center it)
        width: 40 * scalingFactor,
        height: 20 * scalingFactor,
    };

    const lastSlot = {
        x: twoSlots.width,
        y: bottomOffset(20 + 1), // same y-position as twoSlots
        width: 20 * scalingFactor,
        height: 20 * scalingFactor,
    };

    const selector = {
        x: lastSlot.width - scalingFactor,
        y: bottomOffset(22), // slightly above twoSlots and lastSlot (this is where the 2px from those balance)
        width: 22 * scalingFactor,
        height: 22 * scalingFactor,
    };

    const guiCoordinates: ICoordinates<"GUI"> = {
        twoSlots,
        lastSlot,
        selector,
    };

    if (type === "GUI") {
        return guiCoordinates as ICoordinates<T>;
    }

    // ICON coordinates
    const guiWidth =
        guiCoordinates.twoSlots.width + guiCoordinates.lastSlot.width;

    const armor = {
        x: 0,
        y: 0,
        width: 9 * scalingFactor,
        height: 9 * scalingFactor,
    };

    const heartBase = {
        x: 0,
        y: 9 * scalingFactor + 1 * scalingFactor,
        width: armor.width,
        height: armor.height,
    };

    const heart = { ...heartBase };
    const heartBg = { ...heartBase };

    const hungerBase = {
        x: guiWidth - heartBase.width * 3,
        y: heartBase.y,
        width: heartBase.width,
        height: heartBase.height,
    };

    const hunger = { ...hungerBase };
    const hungerBg = { ...hungerBase };

    const xpBg = {
        x: 0,
        y: heartBase.height + armor.height + 2 * scalingFactor,
        width: guiWidth,
        height: xpBarHeight,
    };

    const xp = {
        x: 0,
        y: xpBg.y,
        width: guiWidth * xpPercent,
        height: xpBarHeight,
    };

    const iconCoordinates: ICoordinates<"ICON"> = {
        xpBg,
        hungerBg,
        heartBg,
        xp,
        hunger,
        heart,
        armor,
    };

    if (type === "ICON") {
        return iconCoordinates as ICoordinates<T>;
    }

    throw new Error("Invalid Type!");
}

function getConfigValues() {
    try {
        const config = getConfig();
        const scalingFactor = config.scalingFactor;
        const xpPercent = config.xpPercent;

        return { scalingFactor, xpPercent };
    } catch (err) {
        // Handle error from getConfig()
        console.error("Error fetching config: ", err);
        return undefined;
    }
}
