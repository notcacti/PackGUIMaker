export type ICoordinatesType = "ICON" | "GUI";

// export type ISimpleCoordinates = {
//     x: number;
//     y: number;
// };

type _ICoordinates = {
    x: number;
    y: number;
    width: number;
    height: number;
};

type IIconCoordinates = {
    xpBg: _ICoordinates;
    heart: _ICoordinates;
    hunger: _ICoordinates;
    heartBg: _ICoordinates;
    hungerBg: _ICoordinates;
    xp: _ICoordinates;
    armor: _ICoordinates;
};

type IGUICoordinates = {
    twoSlots: _ICoordinates;
    lastSlot: _ICoordinates;
    selector: _ICoordinates;
};

export type ICoordinates<T extends ICoordinatesType> = T extends "ICON"
    ? IIconCoordinates
    : T extends "GUI"
    ? IGUICoordinates
    : never;

type IIconPaths = {
    xpBg: string;
    heart: string;
    hunger: string;
    hungerBg: string;
    heartBg: string;
    xp: string;
    armor: string;
};

type IGUIPaths = {
    twoSlots: string;
    lastSlot: string;
    selector: string;
};

type ISysPaths = {
    tempPath: string;
    packFolder: string;
    packGuiFolder: string;
    packIconsPath: string;
    packWidgetsPath: string;
    tempIconsPath: string;
    tempWidgetsPath: string;
    configPath: string;
    // Remove while developing app.
    uiSavePath: string;
};

export type IPathType = "SYS" | "ICON" | "GUI";

export type IPaths<T extends IPathType> = T extends "ICON"
    ? IIconPaths
    : T extends "GUI"
    ? IGUIPaths
    : T extends "SYS"
    ? ISysPaths
    : never;

export type IConfig = {
    packFileName: string;
    scalingFactor: number;
    bedrock: boolean;
    xpPercent: number;
    upscaleRate: number;
};

export type IIconInfo = {
    name: string;
    path: string | Buffer;
    destCoordinates: _ICoordinates;
};
