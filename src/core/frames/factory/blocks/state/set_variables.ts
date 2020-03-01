import { StateGenerator } from '../../state.factories';
import { Variable, Color } from '../../../state/arduino.state';
import { VariableTypes } from '../../../../blockly/state/variable.data';
import {
  arduinoStateByVariable,
  getDefaultValue,
  valueToString
} from '../../factory.helpers';
import { getInputValue } from '../../value.factories';
import { findFieldValue } from '../../../../blockly/helpers/block-data.helper';

export const setVariable: StateGenerator = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  const variableId = findFieldValue(block, 'VAR');
  const variable = variables.find((v) => v.id === variableId);
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

  const explanation = `Variable "${variable.name}" stores ${valueToString(
    value,
    variable.type
  )}.`;

  return [
    arduinoStateByVariable(
      block.id,
      timeline,
      newVariable,
      explanation,
      previousState
    )
  ];
};
