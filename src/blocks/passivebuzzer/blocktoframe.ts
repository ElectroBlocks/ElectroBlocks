import { findFieldValue } from "../../core/blockly/helpers/block-data.helper";
import { ArduinoComponentType } from "../../core/frames/arduino.frame";
import {
  BlockToDefaultComponnet,
  BlockToFrameTransformer,
} from "../../core/frames/transformer/block-to-frame.transformer";
import { getInputValue } from "../../core/frames/transformer/block-to-value.factories";
import { arduinoFrameByComponent } from "../../core/frames/transformer/frame-transformer.helpers";
import { Notes, PassiveBuzzerState } from "./state";

export const defaultPassiveBuzzer: BlockToDefaultComponnet = (block) => {
  const pin = findFieldValue(block, "PIN");
  const passiveBuzzerState: PassiveBuzzerState = {
    type: ArduinoComponentType.PASSIVE_BUZZER,
    pins: [pin],
    tone: 0,
    displaySimpleOn: block.blockName === "passive_buzzer_simple",
    setupCommand: `register::bu::${pin}`,
    usbCommands: [],
    enableFlag: "ENABLE_BUZZER",
  };

  return passiveBuzzerState;
};

export const passiveBuzzer: BlockToFrameTransformer = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  const pin = findFieldValue(block, "PIN");
  let tone = 0;
  if (block.blockName === "passive_buzzer_tone") {
    tone = getInputValue(
      blocks,
      block,
      variables,
      timeline,
      "TONE",
      131,
      previousState
    );
  } else {
    tone = +findFieldValue(block, "TONE");
  }
  const passiveBuzzerState: PassiveBuzzerState = {
    type: ArduinoComponentType.PASSIVE_BUZZER,
    pins: [pin],
    tone,
    displaySimpleOn: block.blockName === "passive_buzzer_simple",
    setupCommand: `register::bu::${pin}`,
    usbCommands: [`write::bu::${pin}::${tone}`],
    enableFlag: "ENABLE_BUZZER",
  };
  const explanation = getExplanation(block.blockName, tone, pin);

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

function getExplanation(blockType: string, tone: number, pin: string) {
  if (blockType === "passive_buzzer_simple") {
    return `Turning ${tone > 0 ? "on" : "off"} passive buzzer ${pin}.`;
  }

  return tone === 0
    ? `Turning off passive buzzer ${pin}.`
    : `Setting passive buzzer ${pin} to play tone ${Notes[tone] ?? tone}.`;
}
