import type { BlockData } from "../../core/blockly/dto/block.type";
import { findFieldValue } from "../../core/blockly/helpers/block-data.helper";
import type { RFIDSensor } from "./state";

export const rfidSetupBlockToSensorData = (block: BlockData): RFIDSensor => {
  return {
    scanned_card: findFieldValue(block, "scanned_card") === "TRUE",
    card_number: findFieldValue(block, "card_number"),
    tag: findFieldValue(block, "tag"),
    loop: +findFieldValue(block, "LOOP"),
    blockName: block.blockName,
  };
};
