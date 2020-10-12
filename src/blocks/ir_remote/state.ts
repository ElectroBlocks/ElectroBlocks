import type { ArduinoComponentState } from "../../core/frames/arduino.frame";
import type { ARDUINO_PINS } from "../../core/microcontroller/selectBoard";
import type { Sensor } from "../../core/blockly/dto/sensors.type";

export interface IRRemoteState extends ArduinoComponentState {
  hasCode: boolean;
  code: string;
  analogPin: ARDUINO_PINS;
}

export interface IRRemoteSensor extends Sensor {
  scanned_new_code: boolean;
  code: string;
}
