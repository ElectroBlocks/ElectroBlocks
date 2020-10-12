import { findFieldValue } from "../../core/blockly/helpers/block-data.helper";
import { ArduinoComponentType } from "../../core/frames/arduino.frame";
import type { BlockToFrameTransformer } from "../../core/frames/transformer/block-to-frame.transformer";
import { arduinoFrameByComponent } from "../../core/frames/transformer/frame-transformer.helpers";
import type { RFIDSensor, RfidState } from "./state";

export const rfidSetup: BlockToFrameTransformer = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  const sensorData = JSON.parse(block.metaData) as RFIDSensor[];

  const rfidSensorLoop1 = sensorData.find((s) => s.loop === 1) as RFIDSensor;

  const rfidComponent: RfidState = {
    pins: block.pins,
    type: ArduinoComponentType.RFID,
    txPin: findFieldValue(block, "PIN_TX"),
    scannedCard: rfidSensorLoop1.scanned_card,
    tag: rfidSensorLoop1.tag,
    cardNumber: rfidSensorLoop1.card_number,
  };

  return [
    arduinoFrameByComponent(
      block.id,
      block.blockName,
      timeline,
      rfidComponent,
      "Setting up RFID.",
      previousState
    ),
  ];
};
