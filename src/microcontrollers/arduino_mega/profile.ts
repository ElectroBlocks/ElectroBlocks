import {
  type Breadboard,
  MicroControllerType,
  type PinConnection,
} from "../../core/microcontroller/microcontroller";
import type { MicroController } from "../../core/microcontroller/microcontroller";
import { ARDUINO_PINS } from "../../core/microcontroller/selectBoard";
import _ from "lodash";
// A0 => #B637CC
// A1 => #CC9E37
// A2 => #34CE5F
// A3 => #5533D1
// A4 => #D33158
// A5 => #D15F33

enum WIRE_COLORS {
  PURPLE = "#B637CC",
  LIGHT_BROWN = "#CC9E37",
  GREEN = "#34CE5F",
  DEEP_PURPLE = "#5533D1",
  YELLOW = "#FFE600",
  ORANGE = "#D15F33",
}

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

function createPinConnections() {
  const pinConnections: { [key: string]: PinConnection } = {};
  const colorKeys = _.keys(WIRE_COLORS);

  for (let i = 2; i <= 53; i += 1) {
    const colorIndex = i % colorKeys.length;
    const color = WIRE_COLORS[colorKeys[colorIndex]];
    pinConnections[i.toString()] = {
      color,
      id: `ARDUINO_PIN_${i}`,
    };
  }

  for (let i = 0; i <= 15; i += 1) {
    const colorIndex = i % colorKeys.length;
    const color = WIRE_COLORS[colorKeys[colorIndex]];
    pinConnections[`A${i}`] = {
      color,
      id: `ARDUINO_PIN_A${i}`,
    };
  }

  return pinConnections;
}

const arduinoMega: MicroController = {
  analonPins: [
    "A0",
    "A1",
    "A2",
    "A3",
    "A4",
    "A5",
    "A6",
    "A7",
    "A8",
    "A9",
    "A10",
    "A11",
    "A12",
    "A13",
    "A14",
    "A15",
  ],
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
    "14",
    "15",
    "16",
    "17",
    "18",
    "19",
    "20",
    "21",
    "22",
    "23",
    "24",
    "25",
    "26",
    "27",
    "28",
    "29",
    "30",
    "31",
    "32",
    "33",
    "34",
    "35",
    "36",
    "37",
    "38",
    "39",
    "40",
    "41",
    "42",
    "43",
    "44",
    "45",
    "46",
    "47",
    "48",
    "49",
    "50",
    "51",
    "52",
    "53",
    "A0",
    "A1",
    "A2",
    "A3",
    "A4",
    "A5",
    "A6",
    "A7",
    "A8",
    "A9",
    "A10",
    "A11",
    "A12",
    "A13",
    "A14",
    "A15",
  ],
  misoPins: ["50"],
  mosiPins: ["51"],
  pwmPins: [
    "4",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
    "13",
    "46",
    "45",
    "44",
    "A0",
    "A1",
    "A2",
    "A3",
    "A4",
    "A5",
    "A6",
    "A7",
    "A8",
    "A9",
    "A10",
    "A11",
    "A12",
    "A13",
    "A14",
    "A15",
  ],
  sckPins: ["52"],
  ssPins: ["53"],
  sclPins: ["21"],
  sdaPins: ["20"],
  serial_baud_rate: 9600,
  type: MicroControllerType.ARDUINO_MEGA,
  breadboard,
  skipHoles: [
    1, 2, 3, 4, 6, 7, 8, 10, 12, 14, 15, 16, 18, 20, 22, 23, 25, 26, 28, 29, 31,
    32, 34, 35, 37, 38, 39, 41, 43, 44, 46, 47, 49, 50, 51, 53, 54, 56, 61,
  ],
  pinConnections: createPinConnections(),
};

export default arduinoMega;
