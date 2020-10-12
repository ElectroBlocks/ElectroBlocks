import type { ArduinoComponentState } from "../../core/frames/arduino.frame";
import type { ARDUINO_PINS } from "../../core/microcontroller/selectBoard";

export interface WritePinState extends ArduinoComponentState {
  state: number;
  pinType: WritePinType;
  pin: ARDUINO_PINS;
}

export enum WritePinType {
  DIGITAL_OUTPUT = "DIGITAL_OUTPUT",
  ANALOG_OUTPUT = "ANALOG_OUTPUT",
}
