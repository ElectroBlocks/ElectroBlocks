import { Sensor } from "../../core/blockly/dto/sensors.type";

export interface TimeSensor extends Sensor {
  time_in_seconds: number;
}
