import { ArduinoComponentState } from "./arduino.frame";

export interface ServoState extends ArduinoComponentState {
  degree: number;
}

export interface TemperatureState extends ArduinoComponentState {
  temperature: number;
  humidity: number;
}
