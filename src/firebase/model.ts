
export interface User {
    id: string;
    email: string;
    projects: Project[];
    toolbox: Toolbox[];
}

export interface Project {
    id: string;
    name: string;
    description: string;
    created: Date;
    updated: Date;
}

export interface Toolbox {
    name: string;
    show: boolean;
}

export interface Settings {
  backgroundColor: string;
  touchSkinColor: string;
  ledColor: string;
  customLedColor: boolean;
  maxTimePerMove: number;
}

export const defaultSetting: Settings = {
    backgroundColor: "#d9e4ec",
    touchSkinColor: "#a424d3",
    ledColor: "#AA0000",
    customLedColor: false,
    maxTimePerMove: 1000,
}