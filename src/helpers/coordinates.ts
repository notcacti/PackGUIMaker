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
        hunger: {
            x: 52 * scalingFactor,
            y: 27 * scalingFactor,
            width: 9 * scalingFactor,
            height: 9 * scalingFactor,
        },
        hungerBg: {
            x: 16 * scalingFactor,
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
        heartBg: {
            x: 16 * scalingFactor,
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
        xpEmpty: {
            x: 182 * scalingFactor - xpAdjustmentFactor,
            y: 64 * scalingFactor,
            width: xpAdjustmentFactor,
            height: 5 * scalingFactor,
        },
        xp: {
            x: 0 * scalingFactor,
            y: 69 * scalingFactor,
            width: xpAdjustmentFactor * xpPercent,
            height: 5 * scalingFactor,
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
