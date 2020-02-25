import { StateGenerator } from '../state.factories';
import { Variable, Color } from '../../state/arduino.state';
import { VariableTypes } from '../../../blockly/state/variable.data';
import { arduinoStateByVariable } from './factory.helpers';
import { getInputValue } from '../value.factories';
import { findFieldValue } from '../../../blockly/helpers/block-data.helper';

const getDefaultValue = (type: VariableTypes) => {
  switch (type) {
    case VariableTypes.COLOUR:
      return { red: 0, green: 0, blue: 0 };
    case VariableTypes.STRING:
      return '';
    case VariableTypes.BOOLEAN:
      return true;
    case VariableTypes.NUMBER:
      return 1;
    default:
      return undefined;
  }
};

export const setVariable: StateGenerator = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  const variableId = findFieldValue(block, 'VAR');
  const variable = variables.find(v => v.id === variableId);
  const defaultValue = getDefaultValue(variable.type);

  const value = getInputValue(
    blocks,
    block,
    variables,
    timeline,
    'VALUE',
    defaultValue,
    previousState
  );
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
