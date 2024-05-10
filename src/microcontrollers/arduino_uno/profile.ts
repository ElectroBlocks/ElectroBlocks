import {
  type Breadboard,
  MicroControllerType,
  type PinConnection,
} from "../../core/microcontroller/microcontroller";
import type { MicroController } from "../../core/microcontroller/microcontroller";

enum WIRE_COLORS {
  PURPLE = "#B637CC",
  LIGHT_BROWN = "#CC9E37",
  GREEN = "#34CE5F",
  DEEP_PURPLE = "#5533D1",
  YELLOW = "#FFE600",
  ORANGE = "#D15F33",
}

// You can't use the last hole for power or ground
const breadboard: Breadboard = {
  areas: [
    { holes: [3, 4, 5, 6, 7, 8], taken: false, isDown: true },
    { holes: [9, 10, 11, 12, 13, 14], taken: false, isDown: true },
    { holes: [15, 16, 17, 18, 19, 20], taken: false, isDown: true },
    { holes: [21, 22, 23, 24, 25, 26], taken: false, isDown: true },
    { holes: [27, 28, 29, 30, 31, 32], taken: false, isDown: true },
    { holes: [33, 34, 35, 36, 37, 38], taken: false, isDown: true },
    { holes: [39, 40, 41, 42, 43, 44], taken: false, isDown: true },
    { holes: [45, 46, 47, 48, 49, 50], taken: false, isDown: true },
    { holes: [51, 52, 53, 54, 55, 56], taken: false, isDown: true },
    { holes: [57, 58, 59, 60, 61, 62], taken: false, isDown: true },
  ],
  order: [4, 6, 8, 3, 5, 7, 0, 1, 2, 3, 9, 10],
};

const pinConnections: { [key: string]: PinConnection } = {
  "2": {
    color: WIRE_COLORS.DEEP_PURPLE,
    id: "ARDUINO_PIN_2",
  },
  "3": { color: WIRE_COLORS.YELLOW, id: "ARDUINO_PIN_3" },
  "4": { color: WIRE_COLORS.GREEN, id: "ARDUINO_PIN_4" },
  "5": { color: WIRE_COLORS.LIGHT_BROWN, id: "ARDUINO_PIN_5" },
  "6": { color: WIRE_COLORS.ORANGE, id: "ARDUINO_PIN_6" },
  "7": { color: WIRE_COLORS.PURPLE, id: "ARDUINO_PIN_7" },
  "8": { color: WIRE_COLORS.DEEP_PURPLE, id: "ARDUINO_PIN_8" },
  "9": { color: WIRE_COLORS.YELLOW, id: "ARDUINO_PIN_9" },
  "10": { color: WIRE_COLORS.GREEN, id: "ARDUINO_PIN_10" },
  "11": {
    color: WIRE_COLORS.LIGHT_BROWN,
    id: "ARDUINO_PIN_11",
  },
  "12": {
    color: WIRE_COLORS.ORANGE,
    id: "ARDUINO_PIN_12",
  },
  "13": {
    color: WIRE_COLORS.PURPLE,
    id: "ARDUINO_PIN_13",
  },
  A0: {
    color: WIRE_COLORS.PURPLE,
    id: "ARDUINO_PIN_A0",
  },
  A1: {
    color: WIRE_COLORS.LIGHT_BROWN,
    id: "ARDUINO_PIN_A1",
  },
  A2: {
    color: WIRE_COLORS.GREEN,
    id: "ARDUINO_PIN_A2",
  },
  A3: {
    color: WIRE_COLORS.DEEP_PURPLE,
    id: "ARDUINO_PIN_A3",
  },
  A4: {
    color: WIRE_COLORS.YELLOW,
    id: "ARDUINO_PIN_A4",
  },
  A5: {
    color: WIRE_COLORS.ORANGE,
    id: "ARDUINO_PIN_A5",
  },
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
  breadboard,
  skipHoles: [
    6, 9, 13, 18, 22, 27, 31, 37, 41, 46, 51, 54, 58, 61, 56, 50, 44, 38, 32,
    26, 20, 14, 8,
  ],
  pinConnections,
};

export default unoArduino;
