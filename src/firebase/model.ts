import type { Timestamp } from 'firebase/firestore';
import { MicroControllerType } from '../core/microcontroller/microcontroller';

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
  created: Timestamp | Date;
  updated: Timestamp | Date;
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
  boardType: MicroControllerType;
}

export const defaultSetting: Settings = {
  backgroundColor: '#d9e4ec',
  touchSkinColor: '#a424d3',
  ledColor: '#AA0000',
  customLedColor: false,
  maxTimePerMove: 20,
  boardType: MicroControllerType.ARDUINO_UNO,
};
