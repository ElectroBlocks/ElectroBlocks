import { findFieldValue } from "../../core/blockly/helpers/block-data.helper";
import {
  BlockToFrameTransformer,
  generateInputFrame,
} from "../../core/frames/transformer/block-to-frame.transformer";
import { arduinoFrameByExplanation } from "../../core/frames/transformer/frame-transformer.helpers";

export const customBlock: BlockToFrameTransformer = (
  blocks,
  block,
  variables,
  timeline,
  preivousState
) => {
  const functionName = findFieldValue(block, "NAME");
  const functionCallState = arduinoFrameByExplanation(
    block.id,
    block.blockName,
    timeline,
    `Calling function ${functionName}.`,
    preivousState
  );

  const functionDefinitionBlock = blocks.find(
    (b) =>
      b.blockName === "procedures_defnoreturn" &&
      findFieldValue(b, "NAME") === functionName
  );

  return [
    functionCallState,
    ...generateInputFrame(
      functionDefinitionBlock,
      blocks,
      variables,
      timeline,
      "STACK",
      functionCallState
    ),
  ];
};
