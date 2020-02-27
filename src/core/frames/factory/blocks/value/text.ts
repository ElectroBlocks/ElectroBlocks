import { ValueGenerator, getInputValue } from '../../value.factories';
import {
  findFieldValue,
  findBlockById
} from '../../../../blockly/helpers/block-data.helper';
import _ from 'lodash';

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

export const textLength: ValueGenerator = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  return getInputValue(
    blocks,
    block,
    variables,
    timeline,
    'VALUE',
    '',
    previousState
  ).length;
};

export const textParse: ValueGenerator = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  const delimiter = findFieldValue(block, 'DELIMITER');
  let position = +getInputValue(
    blocks,
    block,
    variables,
    timeline,
    'POSITION',
    1,
    previousState
  );

  if (position < 0) {
    return '';
  }
  position = position == 0 ? 1 : position;

  const stringToParse = getInputValue(
    blocks,
    block,
    variables,
    timeline,
    'VALUE',
    '',
    previousState
  ) as string;

  if (!stringToParse.includes(delimiter)) {
    return '';
  }

  const parts = stringToParse.split(delimiter);

  return parts.length < position ? '' : parts[position - 1];
};

export const textIsEmpty: ValueGenerator = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  const value = getInputValue(
    blocks,
    block,
    variables,
    timeline,
    'VALUE',
    '',
    previousState
  );

  return _.isEmpty(value);
};
