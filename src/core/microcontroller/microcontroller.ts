import { ARDUINO_PINS } from "./selectBoard";

export enum MicroControllerType {
  ARDUINO_UNO = "uno",
  ARDUINO_MEGA = "mega",
}

export interface MicroController {
  digitalPins: string[];
  analonPins: string[];
  serial_baud_rate: number;
  pwmPins: string[];
  sdaPins: string[];
  sclPins: string[];
  mosiPins: string[];
  misoPins: string[];
  sckPins: string[];
  ssPins: string[];
  type: MicroControllerType;
  pinToBreadboardHole: (pin: ARDUINO_PINS) => string;
  skipHoles: number[];
}

export interface MicroControllerBlocks {
  digitalPins: string[][];
  analogPins: string[][];
  serial_baud_rate: number;
  pwmPins: string[][];
  sdaPins: string[][];
  sclPins: string[][];
  mosiPins: string[][];
  misoPins: string[][];
  sckPins: string[][];
  ssPins: string[][];
  type: MicroControllerType;
}
