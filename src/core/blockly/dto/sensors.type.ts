export interface Sensor {
  loop: number;
  blockName: string;
}

export interface MotionSensor extends Sensor {
  cm: number;
}

export interface PinSensor extends Sensor {
  state: number;
}

export interface RFIDSensor extends Sensor {
  scanned_card: boolean;
  card_number: string;
  tag: string;
}

export interface TempSensor extends Sensor {
  temp: number;
  humidity: number;
  loop: number;
}

export interface TimeSensor extends Sensor {
  time_in_seconds: number;
}
