import {
  BoardFamily,
  Breadboard,
  MicroController,
  MicroControllerType,
  PinConnection,
} from "../../core/microcontroller/microcontroller";

enum WIRE_COLORS {
  PURPLE = "#B637CC",
  LIGHT_BROWN = "#CC9E37",
  GREEN = "#34CE5F",
  DEEP_PURPLE = "#5533D1",
  YELLOW = "#FFE600",
  ORANGE = "#D15F33",
}

const pinConnections: { [key: string]: PinConnection } = {
  "0": {
    color: WIRE_COLORS.DEEP_PURPLE,
    id: "ARDUINO_PIN_2",
  },
  "1": { color: WIRE_COLORS.YELLOW, id: "ARDUINO_PIN_3" },
  "2": { color: WIRE_COLORS.GREEN, id: "ARDUINO_PIN_4" },
};

const breadboard: Breadboard = {
  areas: [],
  order: [],
};

const microBit: MicroController = {
  analonPins: ["0", "1", "2"],
  digitalPins: ["0", "1", "2"],
  misoPins: [],
  mosiPins: [],
  pwmPins: ["0", "1", "2"],
  sckPins: [],
  ssPins: [],
  sclPins: [],
  sdaPins: [],
  serial_baud_rate: 115200,
  type: MicroControllerType.MICROBIT,
  boardFamily: BoardFamily.MICROBIT,
  breadboard,
  pinConnections,
  hasBreadboardArea: false,
};

export default microBit;
