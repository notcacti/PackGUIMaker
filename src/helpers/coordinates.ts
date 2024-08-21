import { ICoordinates, ICoordinatesType } from "../types.js";

export function getCoordinates(type: ICoordinatesType, scalingFactor: number) {
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
    };

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

    const coordinatesMap = {
        ICON: iconCoordinates,
        GUI: guiCoordinates,
    };

    const coordinates = coordinatesMap[type];
    if (!coordinates) {
        throw new Error(`Invalid type: ${type}`);
    }

    return coordinates;
}
