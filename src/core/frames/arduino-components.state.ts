import { ArduinoComponentState, Color, ArduinoFrame } from "./arduino.frame";
import { ARDUINO_PINS } from "../microcontroller/selectBoard";

export interface ArduinoReceiveMessageState extends ArduinoComponentState {
  hasMessage: boolean;
  message: string;
}

export interface LedColorState extends ArduinoComponentState {
  redPin: ARDUINO_PINS;
  greenPin: ARDUINO_PINS;
  bluePin: ARDUINO_PINS;
  pictureType: "BUILT_IN" | "BREADBOARD";
  color: Color;
}

export interface LedMatrixState extends ArduinoComponentState {
  leds: Array<{ col: number; row: number; isOn: boolean }>;
  dataPin: ARDUINO_PINS;
  csPin: ARDUINO_PINS;
  clkPin: ARDUINO_PINS;
}

export interface MotorState extends ArduinoComponentState {
  motorNumber: number;
  speed: number;
  direction: MOTOR_DIRECTION;
}

export enum MOTOR_DIRECTION {
  FORWARD = "FORWARD",
  BACKWARD = "BACKWARD",
}

export interface NeoPixelState extends ArduinoComponentState {
  numberOfLeds: number;
  neoPixels: Array<{ position: number; color: Color }>;
}

export interface PinState extends ArduinoComponentState {
  pin: ARDUINO_PINS;
  pinType: PIN_TYPE;
  state: number;
  pinPicture: PinPicture;
  color?: Color;
}

export enum PIN_TYPE {
  DIGITAL_OUTPUT = "DIGITAL_OUTPUT",
  ANALOG_OUTPUT = "ANALOG_OUTPUT",
  ANALOG_INPUT = "ANALOG_INPUT",
  DIGITAL_INPUT = "DIGITAL_INPUT",
}

export enum PinPicture {
  LED = "LED",
  LED_DIGITAL_WRITE = "LED_DIGITAL_WRITE",
  LED_ANALOG_WRITE = "LED_ANALOG_WRITE",
  SENSOR = "SENSOR",
  PHOTO_SENSOR = "PHOTO_SENSOR",
  TOUCH_SENSOR = "TOUCH_SENSOR",
  SOIL_SENSOR = "SOIL_SENSOR",
}

export const pinPictureToWork = (pinPicture: PinPicture) => {
  switch (pinPicture) {
    case PinPicture.LED:
      return "led";
    case PinPicture.LED_DIGITAL_WRITE:
      return "digital pin";
    case PinPicture.LED_ANALOG_WRITE:
      return "analog pin";
    case PinPicture.PHOTO_SENSOR:
      return "photo sensor";
    case PinPicture.TOUCH_SENSOR:
      return "touch sensor";
    case PinPicture.SOIL_SENSOR:
      return "soil sensor";
    default:
      return "sensor";
  }
};

export interface RfidState extends ArduinoComponentState {
  txPin: ARDUINO_PINS;
  scannedCard: boolean;
  cardNumber: string;
  tag: string;
}

export interface ServoState extends ArduinoComponentState {
  degree: number;
}

export interface TemperatureState extends ArduinoComponentState {
  temperature: number;
  humidity: number;
}

export interface TimeState extends ArduinoComponentState {
  timeInSeconds: number;
}

export interface UltraSonicSensorState extends ArduinoComponentState {
  cm: number;
  trigPin: ARDUINO_PINS;
  echoPin: ARDUINO_PINS;
}
