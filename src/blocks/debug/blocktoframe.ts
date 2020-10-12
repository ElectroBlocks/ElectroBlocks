import type { BlockToFrameTransformer } from "../../core/frames/transformer/block-to-frame.transformer";
import { arduinoFrameByExplanation } from "../../core/frames/transformer/frame-transformer.helpers";

export const debugBlock: BlockToFrameTransformer = (
  blocks,
  block,
  variables,
  timeline,
  preivousState
) => {
  return [
    arduinoFrameByExplanation(
      block.id,
      block.blockName,
      timeline,
      "Debug [will pause in Arduino Code.]",
      preivousState
    ),
  ];
};
