import { StateGenerator } from '../state.factories';
import { Variable, Color } from '../../state/arduino.state';
import {
  VariableTypes,
  VariableData
} from '../../../blockly/state/variable.data';
import { getInputBlock, arduinoStateByVariable } from './factory.helpers';
import { getValue } from '../value.factories';
import { findFieldValue } from '../../../blockly/helpers/block-data.helper';

export const setVariable: StateGenerator = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  const inputBlock = getInputBlock(blocks, block, 'VALUE');
  const value = inputBlock
    ? getValue(blocks, inputBlock, variables, timeline, previousState)
    : 1;

  const variableId = findFieldValue(block, 'VAR');
  const variable = variables.find((v) => v.id === variableId);

  const newVariable: Variable = {
    type: variable.type,
    value,
    name: variable.name,
    id: variableId
  };

  return [
    arduinoStateByVariable(
      block.id,
      timeline,
      newVariable,
      createExplanation(newVariable),
      previousState
    )
  ];
};

const createExplanation = (variable: Variable) => {
  if (variable.type === VariableTypes.COLOUR) {
    const value = variable.value as Color;
    return `Variable "${variable.name}" stores [red=${value.red},green=${value.green},blue=${value.blue}].`;
  }

  const value =
    variable.type === VariableTypes.STRING
      ? `"${variable.value}"`
      : variable.value;

  return `Variable "${variable.name}" stores ${value}.`;
};
