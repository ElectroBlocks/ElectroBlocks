import { ArduinoComponentState, Color } from './arduino.state';
import { ARDUINO_UNO_PINS } from '../../../constants/arduino';

export interface ArduinoMessageState extends ArduinoComponentState {
  recievingMessage: boolean;
  message: string;
}

export interface BluetoothState extends ArduinoComponentState {
  rxPin: ARDUINO_UNO_PINS;
  txPin: ARDUINO_UNO_PINS;
  hasMessage: boolean;
  receivedMessage: string;
  sendMessage: string;
}

export interface Button {
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
  '0X27' = '0x27'
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
  BACKWARD = 'BACKWARD'
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
  DIGITAL_INPUT = 'DIGITAL_INPUT'
}

export enum PinPicture {
  LED = 'LED',
  LED_DIGITAL_WRITE = 'LED_DIGITAL_WRITE',
  LED_ANALOG_WRITE = 'LED_ANALOG_WRITE',
  SENSOR = 'SENSOR',
  PHOTO_SENSOR = 'PHOTO_SENSOR',
  TOUCH_SENSOR = 'TOUCH_SENSOR',
  SOIL_SENSOR = 'SOIL_SENSOR'
}

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
