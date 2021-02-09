import { MicroControllerType } from "../../core/microcontroller/microcontroller";
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
