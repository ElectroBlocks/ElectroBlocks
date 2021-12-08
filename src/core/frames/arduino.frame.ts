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
  frameNumber: number;
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
  SERVO = "SERVO_COMPONENT",
  LCD_SCREEN = "LCD_SCREEN_COMPONENT",
  LED_MATRIX = "LED_MATRIX_COMPONENT",
  NEO_PIXEL_STRIP = "NEO_PIXEL_STRIP_COMPONENT",
  FASTLED_STRIP = "FASTLED_STRIP_COMPONENT",
  MOTOR = "MOTOR_COMPONENT",
  PIN = "PIN_COMPONENT",
  BLUE_TOOTH = "BLUE_TOOTH_COMPONENT",
  LED_COLOR = "LED_COLOR_COMPONENT",
  LED = "LED_COMPONENT",
  WRITE_PIN = "WRITE_PIN_COMPONENT",
  RFID = "RFID_COMPONENT",
  BUTTON = "BUTTON_COMPONENT",
  MESSAGE = "MESSAGE_COMPONENT",
  TIME = "TIME_COMPONENT",
  DIGITAL_SENSOR = "DIGITAL_SENSOR_COMPONENT",
  ANALOG_SENSOR = "ANALOG_SENSOR_COMPONENT",
  IR_REMOTE = "IR_REMOTE_COMPONENT",
  ULTRASONICE_SENSOR = "ULTRASONICE_SENSOR_COMPONENT",
  TEMPERATURE_SENSOR = "TEMPERATURE_SENSOR_COMPONENT",
  THERMISTOR = "THERMISTOR",
  PASSIVE_BUZZER = "PASSIVE_BUZZER",
  STEPPER_MOTOR = "STEPPER_MOTOR",
  DIGITAL_DISPLAY = "DIGITAL_DISPLAY",
  JOYSTICK = "JOYSTICK",
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
  ArduinoComponentType.THERMISTOR,
  ArduinoComponentType.JOYSTICK,
];
