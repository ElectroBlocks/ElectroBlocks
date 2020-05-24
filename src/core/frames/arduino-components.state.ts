import { ArduinoComponentState, Color, ArduinoFrame } from './arduino.frame';
import { ARDUINO_UNO_PINS } from '../blockly/selectBoard';

export interface ArduinoMessageState extends ArduinoComponentState {
  hasMessage: boolean;
  message: string;
  sendMessage: string;
}

export interface BluetoothState extends ArduinoComponentState {
  rxPin: ARDUINO_UNO_PINS;
  txPin: ARDUINO_UNO_PINS;
  hasMessage: boolean;
  message: string;
  sendMessage: string;
}

export interface ButtonState extends ArduinoComponentState {
  isPressed: boolean;
}

export interface IRRemoteState extends ArduinoComponentState {
  hasCode: boolean;
  code: string;
  analogPin: ARDUINO_UNO_PINS;
}

export interface LCDScreenState extends ArduinoComponentState {
  rows: number;
  columns: number;
  memoryType: LCD_SCREEN_MEMORY_TYPE;
  rowsOfText: string[];
  blink: { row: number; column: number; blinking: boolean };
  backLightOn: boolean;
}

export enum LCD_SCREEN_MEMORY_TYPE {
  'OX3F' = '0x3F',
  '0X27' = '0x27',
}

export interface LedColorState extends ArduinoComponentState {
  redPin: ARDUINO_UNO_PINS;
  greenPin: ARDUINO_UNO_PINS;
  bluePin: ARDUINO_UNO_PINS;
  pictureType: 'BUILT_IN' | 'BREADBOARD';
  color: Color;
}

export interface LedMatrixState extends ArduinoComponentState {
  leds: Array<{ col: number; row: number; isOn: boolean }>;
}

export interface MotorState extends ArduinoComponentState {
  motorNumber: number;
  speed: number;
  direction: MOTOR_DIRECTION;
}

export enum MOTOR_DIRECTION {
  FORWARD = 'FORWARD',
  BACKWARD = 'BACKWARD',
}

export interface NeoPixelState extends ArduinoComponentState {
  numberOfLeds: number;
  neoPixels: Array<{ position: number; color: Color }>;
}

export interface PinState extends ArduinoComponentState {
  pin: ARDUINO_UNO_PINS;
  pinType: PIN_TYPE;
  state: number;
  pinPicture: PinPicture;
  color?: Color;
}

export enum PIN_TYPE {
  DIGITAL_OUTPUT = 'DIGITAL_OUTPUT',
  ANALOG_OUTPUT = 'ANALOG_OUTPUT',
  ANALOG_INPUT = 'ANALOG_INPUT',
  DIGITAL_INPUT = 'DIGITAL_INPUT',
}

export enum PinPicture {
  LED = 'LED',
  LED_DIGITAL_WRITE = 'LED_DIGITAL_WRITE',
  LED_ANALOG_WRITE = 'LED_ANALOG_WRITE',
  SENSOR = 'SENSOR',
  PHOTO_SENSOR = 'PHOTO_SENSOR',
  TOUCH_SENSOR = 'TOUCH_SENSOR',
  SOIL_SENSOR = 'SOIL_SENSOR',
}

export const pinPictureToWork = (pinPicture: PinPicture) => {
  switch (pinPicture) {
    case PinPicture.LED:
      return 'led';
    case PinPicture.LED_DIGITAL_WRITE:
      return 'digital pin';
    case PinPicture.LED_ANALOG_WRITE:
      return 'analog pin';
    case PinPicture.PHOTO_SENSOR:
      return 'photo sensor';
    case PinPicture.TOUCH_SENSOR:
      return 'touch sensor';
    case PinPicture.SOIL_SENSOR:
      return 'soil sensor';
    default:
      return 'sensor';
  }
};

export interface RfidState extends ArduinoComponentState {
  rxPin: ARDUINO_UNO_PINS;
  txPin: ARDUINO_UNO_PINS;
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
  trigPin: ARDUINO_UNO_PINS;
  echoPin: ARDUINO_UNO_PINS;
}
