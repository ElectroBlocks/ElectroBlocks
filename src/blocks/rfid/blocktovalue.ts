import { ArduinoComponentType } from "../../core/frames/arduino.frame";
import type { ValueGenerator } from "../../core/frames/transformer/block-to-value.factories";
import { findComponent } from "../../core/frames/transformer/frame-transformer.helpers";
import type { RfidState } from "./state";

export const rfidScannedCard: ValueGenerator = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  return findComponent<RfidState>(previousState, ArduinoComponentType.RFID)
    .scannedCard;
};

export const rfidTag: ValueGenerator = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  return findComponent<RfidState>(previousState, ArduinoComponentType.RFID).tag;
};

export const rfidCardNumber: ValueGenerator = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  return findComponent<RfidState>(previousState, ArduinoComponentType.RFID)
    .cardNumber;
};
