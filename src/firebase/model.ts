import firebase from "firebase";

export interface User {
    id: string;
    email: string;
    projects: Project[];
    toolbox: Toolbox[];
}

export interface Project {
  userId: string;
  name: string;
  description: string;
  created: firebase.firestore.Timestamp | Date;
  updated: firebase.firestore.Timestamp | Date;
  canShare: boolean;
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