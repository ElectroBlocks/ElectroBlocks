import { findFieldValue } from '../../../blockly/helpers/block-data.helper';
import {
  arduinoStateByExplanation,
  generateInputState,
} from '../frame-transformer.helpers';
import { BlockToFrameTransformer } from '../block-to-frame.transformer';

export const customBlock: BlockToFrameTransformer = (
  blocks,
  block,
  variables,
  timeline,
  preivousState
) => {
  const functionName = findFieldValue(block, 'NAME');
  const functionCallState = arduinoStateByExplanation(
    block.id,
    block.blockName,
    timeline,
    `Calling function ${functionName}.`,
    preivousState
  );

  const functionDefinitionBlock = blocks.find(
    (b) =>
      b.blockName === 'procedures_defnoreturn' &&
      findFieldValue(b, 'NAME') === functionName
  );

  return [
    functionCallState,
    ...generateInputState(
      functionDefinitionBlock,
      blocks,
      variables,
      timeline,
      'STACK',
      functionCallState
    ),
  ];
};
