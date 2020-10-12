import type { BlockData } from "../../core/blockly/dto/block.type";
import { findFieldValue } from "../../core/blockly/helpers/block-data.helper";
import type { IRRemoteSensor } from "./state";

export const irRemoteSetupBlocktoSensorData = (
  block: BlockData
): IRRemoteSensor => {
  return {
    scanned_new_code: findFieldValue(block, "scanned_new_code") === "TRUE",
    code: findFieldValue(block, "code"),
    loop: +findFieldValue(block, "LOOP"),
    blockName: block.blockName,
  };
};
