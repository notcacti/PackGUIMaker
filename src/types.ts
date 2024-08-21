export type ICoordinatesType = "ICON" | "GUI";

type _ICoordinates = {
    x: number;
    y: number;
    width: number;
    height: number;
};

type IIconCoordinates = {
    hunger: _ICoordinates;
    hungerBg: _ICoordinates;
    heart: _ICoordinates;
    heartBg: _ICoordinates;
    armor: _ICoordinates;
    xp?: _ICoordinates;
    xpEmpty?: _ICoordinates;
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
    hunger: string;
    hungerBg: string;
    heart: string;
    heartBg: string;
    xpEmpty: string;
    xp: string;
    armor: string;
};

type IGUIPaths = {
    twoSlots: string;
    lastSlot: string;
    selector: string;
    gui: string;
    // Remove while developing app.
    uiImg: string;
};

type ISysPaths = {
    tempPath: string;
    packFolder: string;
    packGuiFolder: string;
    packIconsFolder: string;
    packWidgetsPath: string;
    tempIconsPath: string;
    tempWidgetsPath: string;
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
