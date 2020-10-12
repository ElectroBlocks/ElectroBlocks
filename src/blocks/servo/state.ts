import type { ArduinoComponentState } from "../../core/frames/arduino.frame";

export interface ServoState extends ArduinoComponentState {
  degree: number;
}
