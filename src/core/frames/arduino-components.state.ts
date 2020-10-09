import { ArduinoComponentState } from "./arduino.frame";

export interface TemperatureState extends ArduinoComponentState {
  temperature: number;
  humidity: number;
}
