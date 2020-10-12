import type { Sensor } from "../../core/blockly/dto/sensors.type";
import type { ArduinoComponentState } from "../../core/frames/arduino.frame";

export interface ArduinoRecieveMessageSensor extends Sensor {
  receiving_message: boolean;
  message: string;
}

export interface ArduinoReceiveMessageState extends ArduinoComponentState {
  hasMessage: boolean;
  message: string;
}
