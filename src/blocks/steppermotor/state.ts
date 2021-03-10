import { ArduinoComponentState } from "../../core/frames/arduino.frame";

export interface StepperMotorState extends ArduinoComponentState {
  totalSteps: number;
  steps: number;
}
