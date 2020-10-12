import type { ArduinoComponentState } from "../../core/frames/arduino.frame";
import type { ARDUINO_PINS } from "../../core/microcontroller/selectBoard";

export interface LedMatrixState extends ArduinoComponentState {
  leds: Array<{ col: number; row: number; isOn: boolean }>;
  dataPin: ARDUINO_PINS;
  csPin: ARDUINO_PINS;
  clkPin: ARDUINO_PINS;
}
