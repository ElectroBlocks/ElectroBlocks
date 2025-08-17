import type { BlockData } from "../../core/blockly/dto/block.type";
import { findFieldValue } from "../../core/blockly/helpers/block-data.helper";
import { getBlockByType } from "../../core/blockly/helpers/block.helper";
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
  const rxPin = findFieldValue(block, "PIN_TX");
  const txPin = findFieldValue(block, "PIN_RX");

  return {
    type: ArduinoComponentType.RFID,
    txPin,
    rxPin,
    pins: [rxPin, txPin],
    scannedCard: rfidSensor.scanned_card,
    cardNumber: rfidSensor.card_number,
    tag: rfidSensor.tag,
    setupCommand: `config:rfid=${rxPin},${txPin}`,
  };
};

export const rfidStateStringToComponentState = (
  sensorStr: string,
  blocks: BlockData[]
): RfidState => {
  const setupBlock = blocks.find((b) => b.blockName == "rfid_setup");
  const [_, pinStr, state] = sensorStr.split(":");
  const rxPin = findFieldValue(setupBlock, "PIN_TX");
  const txPin = findFieldValue(setupBlock, "PIN_RX");
  const tagAndCardNumber = state.split("-");
  return {
    type: ArduinoComponentType.RFID,
    txPin,
    rxPin,
    pins: [rxPin, txPin],
    scannedCard: tagAndCardNumber.length == 2,
    cardNumber: tagAndCardNumber.length == 2 ? tagAndCardNumber[0] : "",
    tag: tagAndCardNumber.length == 2 ? tagAndCardNumber[1] : "",
    setupCommand: `config:rfid=${rxPin},${txPin}`,
  };
};