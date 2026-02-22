import { MicroController, MicroControllerType } from "../../core/microcontroller/microcontroller";


const microbit: MicroController = {
  "type": MicroControllerType.MICROBIT,

  "digitalPins": ["P0", "P1", "P2"],
  "analonPins": ["P0", "P1", "P2"],

  "serial_baud_rate": 115200,

  "pwmPins": ["P0", "P1", "P2"],
  "pwmNonAnalogPins": [],

  "sdaPins": [],
  "sclPins": [],

  "mosiPins": [],
  "misoPins": [],
  "sckPins": [],
  "ssPins": [],

  "breadboard": {
    "areas": [],
    "order": []
  },

  "skipHoles": [],

  "pinConnections": {}
}

export default microbit;