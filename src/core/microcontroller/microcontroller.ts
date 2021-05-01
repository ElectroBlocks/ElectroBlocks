export enum MicroControllerType {
  ARDUINO_UNO = "uno",
  ARDUINO_MEGA = "mega",
  MICROBIT = "microbit",
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

export enum BoardFamily {
  ARDUINO_STANDARD = "ARDUINO_STANDARD",
  MICROBIT = "MICROBIT",
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
  boardFamily: BoardFamily;
  pinConnections: { [key: string]: PinConnection };
  hasBreadboardArea: boolean;
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
