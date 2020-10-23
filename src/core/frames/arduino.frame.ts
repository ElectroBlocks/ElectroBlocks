import type { Settings } from "../../firebase/model";
import type { VariableTypes } from "../blockly/dto/variable.type";
import type { MicroControllerType } from "../microcontroller/microcontroller";
import type { ARDUINO_PINS } from "../microcontroller/selectBoard";


export interface ArduinoFrameContainer {
  board: MicroControllerType;
  frames: ArduinoFrame[];
  settings: Settings;
  error: boolean;
}

export interface ArduinoFrame {
  blockId: string;
  blockName: string;
  timeLine: Timeline;
  explanation: string;
  components: ArduinoComponentState[];
  variables: { [key: string]: Variable };
  txLedOn: boolean;
  builtInLedOn: boolean;
  sendMessage: string; // message arduino is sending
  delay: number; // Number of milliseconds to delay
  powerLedOn: boolean;
}

export interface Variable {
  id: string;
  name: string;
  value:
    | number
    | string
    | boolean
    | Color
    | number[]
    | string[]
    | boolean[]
    | Color[];
  type: VariableTypes;
}

export interface Color {
  red: number;
  green: number;
  blue: number;
}

export interface Timeline {
  iteration: number;

  function: "setup" | "loop" | "pre-setup";
}

export interface ArduinoComponentState {
  pins: ARDUINO_PINS[];
  type: ArduinoComponentType;
}

export enum ArduinoComponentType {
  SERVO = "SERVO",
  LCD_SCREEN = "LCD_SCREEN",
  LED_MATRIX = "LED_MATRIX",
  NEO_PIXEL_STRIP = "NEO_PIXEL_STRIP",
  MOTOR = "MOTOR",
  PIN = "PIN",
  BLUE_TOOTH = "BLUE_TOOTH",
  LED_COLOR = "LED_COLOR",
  LED = "LED",
  WRITE_PIN = "WRITE_PIN",
  RFID = "RFID",
  BUTTON = "BUTTON",
  MESSAGE = "MESSAGE",
  TIME = "TIME",
  DIGITAL_SENSOR = "DIGITAL_SENSOR",
  ANALOG_SENSOR = "ANALOG_SENSOR",
  IR_REMOTE = "IR_REMOTE",
  ULTRASONICE_SENSOR = "ULTRASONICE_SENSOR",
  TEMPERATURE_SENSOR = "TEMPERATURE_SENSOR",
}

export const SENSOR_COMPONENTS = [
  ArduinoComponentType.TEMPERATURE_SENSOR,
  ArduinoComponentType.TIME,
  ArduinoComponentType.BUTTON,
  ArduinoComponentType.BLUE_TOOTH,
  ArduinoComponentType.IR_REMOTE,
  ArduinoComponentType.RFID,
  ArduinoComponentType.ULTRASONICE_SENSOR,
  ArduinoComponentType.MESSAGE,
  ArduinoComponentType.DIGITAL_SENSOR,
  ArduinoComponentType.ANALOG_SENSOR,
];
