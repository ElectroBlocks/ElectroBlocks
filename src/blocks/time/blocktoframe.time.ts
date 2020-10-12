import { findFieldValue } from "../../core/blockly/helpers/block-data.helper";
import type { TimeState } from "./state";
import { ArduinoComponentType } from "../../core/frames/arduino.frame";
import type { BlockToFrameTransformer } from "../../core/frames/transformer/block-to-frame.transformer";
import { arduinoFrameByComponent } from "../../core/frames/transformer/frame-transformer.helpers";

export const timeSetup: BlockToFrameTransformer = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  const timeComonent: TimeState = {
    pins: block.pins,
    timeInSeconds: +findFieldValue(block, "time_in_seconds"),
    type: ArduinoComponentType.TIME,
  };

  return [
    arduinoFrameByComponent(
      block.id,
      block.blockName,
      timeline,
      timeComonent,
      "Setting up Arduino time.",
      previousState
    ),
  ];
};
