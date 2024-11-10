import type { ArduinoComponentState, Color } from "../../core/frames/arduino.frame";
import type { ARDUINO_PINS } from "../../core/microcontroller/selectBoard";

export interface LedColorState extends ArduinoComponentState {
  redPin1: ARDUINO_PINS;
  greenPin1: ARDUINO_PINS;
  bluePin1: ARDUINO_PINS;
  redPin2?: ARDUINO_PINS;
  greenPin2?: ARDUINO_PINS;
  bluePin2?: ARDUINO_PINS;
  numberOfComponents: number;
  color: Color;
  color2: Color;
}
