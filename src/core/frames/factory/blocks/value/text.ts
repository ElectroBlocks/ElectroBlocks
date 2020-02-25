import { ValueGenerator, getInputValue } from '../../value.factories';
import {
  findFieldValue,
  findBlockById
} from '../../../../blockly/helpers/block-data.helper';

export const text: ValueGenerator = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  return findFieldValue(block, 'TEXT');
};

export const textJoin: ValueGenerator = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  return block.inputBlocks.reduce((prev, next) => {
    if (!next.blockId || !next.name.includes('ADD')) {
      return prev;
    }

    return (
      prev +
      getInputValue(
        blocks,
        block,
        variables,
        timeline,
        next.name,
        '',
        previousState
      )
    );
  }, '');
};
