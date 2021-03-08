import { findFieldValue } from "../../core/blockly/helpers/block-data.helper";
import { ArduinoComponentType } from "../../core/frames/arduino.frame";
import { BlockToFrameTransformer } from "../../core/frames/transformer/block-to-frame.transformer";
import { getInputValue } from "../../core/frames/transformer/block-to-value.factories";
import { arduinoFrameByComponent } from "../../core/frames/transformer/frame-transformer.helpers";
import { PassiveBuzzerState, NOTE_TONES } from "./state";

export const passiveBuzzer: BlockToFrameTransformer = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  const pin = findFieldValue(block, "PIN");
  let tone = 0;
  if (block.blockName === "passive_buzzer_note") {
    tone = +findFieldValue(block, "TONE");
  } else {
    tone = getInputValue(
      blocks,
      block,
      variables,
      timeline,
      "TONE",
      131,
      previousState
    );
  }
  const passiveBuzzerState: PassiveBuzzerState = {
    type: ArduinoComponentType.PASSIVE_BUZZER,
    pins: [pin],
    tone,
  };
  const explanation =
    tone === 0
      ? `Turning off passive buzzer ${pin}.`
      : `Setting passive buzzer ${pin} tone to ${tone}.`;

  return [
    arduinoFrameByComponent(
      block.id,
      block.blockName,
      timeline,
      passiveBuzzerState,
      explanation,
      previousState
    ),
  ];
};
