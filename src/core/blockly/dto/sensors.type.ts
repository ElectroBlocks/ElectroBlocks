export interface Sensor {
  loop: number;
  blockName: string;
}

export interface TempSensor extends Sensor {
  temp: number;
  humidity: number;
  loop: number;
}
