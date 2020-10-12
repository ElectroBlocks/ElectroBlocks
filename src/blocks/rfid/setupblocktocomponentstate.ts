import type { BlockData } from "../../core/blockly/dto/block.type";
import { findFieldValue } from "../../core/blockly/helpers/block-data.helper";
import { findSensorState } from "../../core/blockly/helpers/sensor_block.helper";
import {
  ArduinoComponentType,
  Timeline,
} from "../../core/frames/arduino.frame";
import type { ARDUINO_PINS } from "../../core/microcontroller/selectBoard";
import type { RFIDSensor, RfidState } from "./state";

export const rfidSetupBlockToComponentState = (
  block: BlockData,
  timeline: Timeline
): RfidState => {
  const rfidSensor = findSensorState<RFIDSensor>(block, timeline);

  return {
    type: ArduinoComponentType.RFID,
    txPin: findFieldValue(block, "PIN_TX") as ARDUINO_PINS,
    pins: [findFieldValue(block, "PIN_TX") as ARDUINO_PINS],
    scannedCard: rfidSensor.scanned_card,
    cardNumber: rfidSensor.card_number,
    tag: rfidSensor.tag,
  };
};
