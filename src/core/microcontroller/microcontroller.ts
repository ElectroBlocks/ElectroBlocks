import type { ARDUINO_PINS } from "./selectBoard";

export enum MicroControllerType {
  ARDUINO_UNO = "uno",
  ARDUINO_MEGA = "mega",
}

export interface BreadBoardArea {
  holes: number[];
  taken: boolean;
  isDown: boolean;
}

export interface PinConnection {
  /**
   * The connection id for the pin
   */
  id: string;
  /**
   * The hex color to use for the wire
   */
  color: string;
}

export interface Breadboard {
  areas: BreadBoardArea[];
  order: number[];
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
  breadboard: Breadboard;
  skipHoles: number[];
  pinConnections: { [key: string]: PinConnection };
}

export interface MicroControllerBlocks {
  digitalPins: [string, string][];
  analogPins: [string, string][];
  serial_baud_rate: number;
  pwmPins: [string, string][];
  sdaPins: [string, string][];
  sclPins: [string, string][];
  mosiPins: [string, string][];
  misoPins: [string, string][];
  sckPins: [string, string][];
  ssPins: [string, string][];
  type: MicroControllerType;
}
