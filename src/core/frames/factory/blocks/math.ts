import { ValueGenerator, getValue, getInputValue } from '../value.factories';
import {
  findFieldValue,
  findBlockById
} from '../../../blockly/helpers/block-data.helper';

export const mathNumber: ValueGenerator = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  return +findFieldValue(block, 'NUM');
};

export const mathArithmetic: ValueGenerator = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  const aValue = +getInputValue(
    blocks,
    block,
    variables,
    timeline,
    'A',
    1,
    previousState
  );
  const bValue = +getInputValue(
    blocks,
    block,
    variables,
    timeline,
    'B',
    1,
    previousState
  );

  const operator = findFieldValue(block, 'OP');

  switch (operator) {
    case 'ADD':
      return aValue + bValue;
    case 'MINUS':
      return aValue - bValue;
    case 'MULTIPLY':
      return aValue * bValue;
    case 'DIVIDE':
      return aValue / bValue;
    case 'POWER':
      return Math.pow(aValue, bValue);
    default:
      return 1;
  }
};
