import { Sensor } from "../../core/blockly/dto/sensors.type";
import { ArduinoComponentState } from "../../core/frames/arduino.frame";

export interface ThermistorState extends ArduinoComponentState {
  temp: number;
  externalResistorsOhms: number;
}

export interface ThermistorSensor extends Sensor {
  temp: number;
}
