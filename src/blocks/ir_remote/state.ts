import { ArduinoComponentState } from "../../core/frames/arduino.frame";
import { ARDUINO_PINS } from "../../core/microcontroller/selectBoard";
import { Sensor } from "../../core/blockly/dto/sensors.type";

export interface IRRemoteState extends ArduinoComponentState {
  hasCode: boolean;
  code: string;
  analogPin: ARDUINO_PINS;
}

export interface IRRemoteSensor extends Sensor {
  scanned_new_code: boolean;
  code: string;
}
