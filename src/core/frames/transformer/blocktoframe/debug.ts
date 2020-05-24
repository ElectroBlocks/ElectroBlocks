import { BlockToFrameTransformer } from '../block-to-frame.transformer';
import { arduinoStateByExplanation } from '../frame-transformer.helpers';

export const debugBlock: BlockToFrameTransformer = (
  blocks,
  block,
  variables,
  timeline,
  preivousState
) => {
  return [
    arduinoStateByExplanation(
      block.id,
      timeline,
      'Debug [will pause in Arduino Code.]',
      preivousState
    ),
  ];
};
