import {
  Breadboard,
  BreadBoardArea,
  MicroControllerType,
} from "../../core/microcontroller/microcontroller";
import type { MicroController } from "../../core/microcontroller/microcontroller";

import type { ARDUINO_PINS } from "../../core/microcontroller/selectBoard";

enum ARDUINO_BREADBOARD_WIRES_CONNECT_POINTS {
  PIN_13 = "pin2E",
  PIN_12 = "pin6E",
  PIN_11 = "pin9E",
  PIN_10 = "pin13E",
  PIN_9 = "pin18E",
  PIN_8 = "pin22E",
  PIN_7 = "pin27E",
  PIN_6 = "pin31E",
  PIN_5 = "pin37E",
  PIN_4 = "pin41E",
  PIN_3 = "pin46E",
  PIN_2 = "pin51E",
  PIN_A0 = "pin54E",
  PIN_A1 = "pin58E",
  PIN_A2 = "pin4F",
  PIN_A3 = "pin8F",
  PIN_A4 = "pin12F",
  PIN_A5 = "pin16F",
}

const pinToBreadboardHole = (pin: ARDUINO_PINS): string => {
  return (
    ARDUINO_BREADBOARD_WIRES_CONNECT_POINTS[`PIN_${pin}`] ||
    ARDUINO_BREADBOARD_WIRES_CONNECT_POINTS.PIN_2
  );
};

const breadboard: Breadboard = {
  areas: [
    { holes: [4, 5, 6, 7], taken: false, color: "#d07f92" },
    { holes: [9, 10, 11, 12, 13], taken: false, color: "#b47fd0" },
    { holes: [15, 16, 17, 18, 19], taken: false, color: "#7f8dd0" },
    { holes: [21, 22, 23, 24, 25], taken: false, color: "#7fd0c1" },
    { holes: [27, 28, 29, 30, 31], taken: false, color: "#c0d07f" },
    { holes: [33, 34, 35, 36, 37], taken: false, color: "#2c8d2a" },
    { holes: [39, 40, 41, 42, 43], taken: false, color: "#2a5b8d" },
    { holes: [45, 46, 47, 48, 49], taken: false, color: "#8b2a8d" },
    { holes: [51, 52, 53, 54, 55], taken: false, color: "#2a4d8d" },
    { holes: [57, 58, 59, 60], taken: false, color: "#d78b3e" },
  ],
  order: [5, 7, 3, 4, 6, 2, 8, 1, 9, 0],
};

const unoArduino: MicroController = {
  analonPins: ["A5", "A4", "A3", "A2", "A1", "A0"],
  digitalPins: [
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
    "13",
    "A0",
    "A1",
    "A2",
    "A3",
    "A4",
    "A5",
  ],
  misoPins: ["12"],
  mosiPins: ["11"],
  pwmPins: ["3", "5", "6", "9", "10", "11", "A0", "A1", "A2", "A3", "A4", "A5"],
  sckPins: ["13"],
  ssPins: ["10"],
  sclPins: ["A5"],
  sdaPins: ["A4"],
  serial_baud_rate: 9600,
  type: MicroControllerType.ARDUINO_UNO,
  pinToBreadboardHole,
  breadboard,
  skipHoles: [
    6,
    9,
    13,
    18,
    22,
    27,
    31,
    37,
    41,
    46,
    51,
    54,
    58,
    61,
    56,
    50,
    44,
    38,
    32,
    26,
    20,
    14,
    8,
  ],
};

export default unoArduino;
