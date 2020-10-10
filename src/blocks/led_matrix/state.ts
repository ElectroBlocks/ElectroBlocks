import { ArduinoComponentState } from "../../core/frames/arduino.frame";
import { ARDUINO_PINS } from "../../core/microcontroller/selectBoard";

export interface LedMatrixState extends ArduinoComponentState {
  leds: Array<{ col: number; row: number; isOn: boolean }>;
  dataPin: ARDUINO_PINS;
  csPin: ARDUINO_PINS;
  clkPin: ARDUINO_PINS;
}
