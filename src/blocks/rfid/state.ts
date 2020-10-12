import type { Sensor } from "../../core/blockly/dto/sensors.type";
import type { ArduinoComponentState } from "../../core/frames/arduino.frame";
import type { ARDUINO_PINS } from "../../core/microcontroller/selectBoard";

export interface RFIDSensor extends Sensor {
  scanned_card: boolean;
  card_number: string;
  tag: string;
}

export interface RfidState extends ArduinoComponentState {
  txPin: ARDUINO_PINS;
  scannedCard: boolean;
  cardNumber: string;
  tag: string;
}
