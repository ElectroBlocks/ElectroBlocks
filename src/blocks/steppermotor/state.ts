import { ArduinoComponentState } from "../../core/frames/arduino.frame";
import { ARDUINO_PINS } from "../../core/microcontroller/selectBoard";

export interface StepperMotorState extends ArduinoComponentState {
  totalSteps: number;
  steps: number;
  currentRotation: number;
  pin1: ARDUINO_PINS;
  pin2: ARDUINO_PINS;
  pin3: ARDUINO_PINS;
  pin4: ARDUINO_PINS;
}
