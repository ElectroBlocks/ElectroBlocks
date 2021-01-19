import {
  BlockToFrameTransformer,
  generateInputFrame,
} from "../../core/frames/transformer/block-to-frame.transformer";
import { getInputValue } from "../../core/frames/transformer/block-to-value.factories";
import { arduinoFrameByExplanation } from "../../core/frames/transformer/frame-transformer.helpers";

export const ifElse: BlockToFrameTransformer = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  const excuteBlocksInsideIf = getInputValue(
    blocks,
    block,
    variables,
    timeline,
    "IF0",
    false,
    previousState
  );

  if (excuteBlocksInsideIf) {
    const explanation =
      'Executing blocks inside "DO" because what is connected is true.';
    const ifFrame = arduinoFrameByExplanation(
      block.id,
      block.blockName,
      timeline,
      explanation,
      previousState
    );
    return [
      ifFrame,
      ...generateInputFrame(
        block,
        blocks,
        variables,
        timeline,
        "DO0",
        previousState
      ),
    ];
  }

  if (block.inputStatements.find((i) => i.name === "ELSE")) {
    const explanation =
      'Executing blocks inside "ELSE" because what is connected is false.';
    const ifFrame = arduinoFrameByExplanation(
      block.id,
      block.blockName,
      timeline,
      explanation,
      previousState
    );
    return [
      ifFrame,
      ...generateInputFrame(
        block,
        blocks,
        variables,
        timeline,
        "ELSE",
        previousState
      ),
    ];
  }
  const explanation =
    'Not executing blocks inside "DO" because what is connected is false.';
  return [
    arduinoFrameByExplanation(
      block.id,
      block.blockName,
      timeline,
      explanation,
      previousState
    ),
  ];
};
