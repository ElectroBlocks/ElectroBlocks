import { MicroControllerBlocks } from "./microcontroller";
import unoArduino from "./arduino_uno.board";
import { transformBoardBlockly } from "./microcontroller.helpers";
/**
 * Arduino Board profiles
 *
 */
const arduino_uno = {
  description: "Arduino standard-compatible board",
  digitalPins: [
    ["2", "2"],
    ["3", "3"],
    ["4", "4"],
    ["5", "5"],
    ["6", "6"],
    ["7", "7"],
    ["8", "8"],
    ["9", "9"],
    ["10", "10"],
    ["11", "11"],
    ["12", "12"],
    ["13", "13"],
    ["A0", "A0"],
    ["A1", "A1"],
    ["A2", "A2"],
    ["A3", "A3"],
    ["A4", "A4"],
    ["A5", "A5"],
  ],
  pwmPins: [
    ["3", "3"],
    ["5", "5"],
    ["6", "6"],
    ["9", "9"],
    ["10", "10"],
    ["11", "11"],
    ["A0", "A0"],
    ["A1", "A1"],
    ["A2", "A2"],
    ["A3", "A3"],
    ["A4", "A4"],
    ["A5", "A5"],
  ],
  analogPins: [
    ["A0", "A0"],
    ["A1", "A1"],
    ["A2", "A2"],
    ["A3", "A3"],
    ["A4", "A4"],
    ["A5", "A5"],
  ],
  serial_baud_rate: 115200,
  type: "uno",
};

const selectedBoard = () => {
  return arduino_uno;
};

export const selectBoardBlockly = (): MicroControllerBlocks => {
  return transformBoardBlockly(unoArduino);
};

export enum ARDUINO_UNO_PINS {
  PIN_1 = "1",
  PIN_2 = "2",
  PIN_3 = "3",
  PIN_4 = "4",
  PIN_5 = "5",
  PIN_6 = "6",
  PIN_7 = "7",
  PIN_8 = "8",
  PIN_9 = "9",
  PIN_10 = "10",
  PIN_11 = "11",
  PIN_12 = "12",
  PIN_13 = "13",
  PIN_A0 = "A0",
  PIN_A1 = "A1",
  PIN_A2 = "A2",
  PIN_A3 = "A3",
  PIN_A4 = "A4",
  PIN_A5 = "A5",
  NO_PINS = "NO_PINS",
}

export const ANALOG_PINS = [
  ARDUINO_UNO_PINS.PIN_A0,
  ARDUINO_UNO_PINS.PIN_A1,
  ARDUINO_UNO_PINS.PIN_A2,
  ARDUINO_UNO_PINS.PIN_A3,
  ARDUINO_UNO_PINS.PIN_A4,
  ARDUINO_UNO_PINS.PIN_A5,
];

export default selectedBoard;
