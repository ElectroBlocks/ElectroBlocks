import { BlockToFrameTransformer } from '../block-to-frame.transformer';
import { arduinoFrameByExplanation } from '../frame-transformer.helpers';

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
      'Debug [will pause in Arduino Code.]',
      preivousState
    ),
  ];
};
