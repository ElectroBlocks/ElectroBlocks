import { BlockToFrameTransformer } from '../block-to-frame.transformer';
import { Variable, Color } from '../../arduino.frame';
import { VariableTypes } from '../../../blockly/dto/variable.type';
import {
  arduinoFrameByVariable,
  getDefaultValue,
  valueToString,
} from '../frame-transformer.helpers';
import { getInputValue } from '../block-to-value.factories';
import { findFieldValue } from '../../../blockly/helpers/block-data.helper';

export const setVariable: BlockToFrameTransformer = (
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
    id: variableId,
  };

  const explanation = `Variable "${variable.name}" stores ${valueToString(
    value,
    variable.type
  )}.`;

  return [
    arduinoFrameByVariable(
      block.id,
      block.blockName,
      timeline,
      newVariable,
      explanation,
      previousState
    ),
  ];
};
