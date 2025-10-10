import { ArduinoComponentState } from "../../core/frames/arduino.frame";
import { Sensor } from "../../core/blockly/dto/sensors.type";

export interface TemperatureState extends ArduinoComponentState {
  temperature: number;
  humidity: number;
  tempType: "DHT11" | "DHT22";
}

export interface TempSensor extends Sensor {
  temp: number;
  humidity: number;
  loop: number;
}
