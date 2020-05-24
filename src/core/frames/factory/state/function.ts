import { findFieldValue } from '../../../blockly/helpers/block-data.helper';
import {
  arduinoStateByExplanation,
  generateInputState,
} from '../factory.helpers';
import { StateGenerator } from '../state.factories';

export const customBlock: StateGenerator = (
  blocks,
  block,
  variables,
  timeline,
  preivousState
) => {
  const functionName = findFieldValue(block, 'NAME');
  const functionCallState = arduinoStateByExplanation(
    block.id,
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
