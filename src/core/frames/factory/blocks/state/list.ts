import { StateGenerator } from '../../state.factories';
import { ArduinoState, Variable, Timeline } from '../../../state/arduino.state';
import { findFieldValue } from '../../../../blockly/helpers/block-data.helper';
import { BlockData } from '../../../../blockly/state/block.data';
import {
  VariableTypes,
  VariableData
} from '../../../../blockly/state/variable.data';
import _ from 'lodash';
import { arduinoStateByVariable } from '../../factory.helpers';

const createListState = (
  type: VariableTypes,
  block: BlockData,
  variables: VariableData[],
  timeline: Timeline,
  previousState: ArduinoState = undefined
) => {
  const newVariable = createVariable(block, variables, type);

  return [
    arduinoStateByVariable(
      block.id,
      timeline,
      newVariable,
      createExplanation(newVariable, +findFieldValue(block, 'SIZE')),
      previousState
    )
  ];
};

const createExplanation = (variable: Variable, size: number) => {
  return `Creating a ${typeToHumanWord(variable.type)} variable named "${
    variable.name
  }" that stores ${size} items.`;
};

const typeToHumanWord = (type: VariableTypes) => {
  switch (type) {
    case VariableTypes.LIST_BOOLEAN:
      return 'boolean list';
    case VariableTypes.LIST_NUMBER:
      return 'number list';
    case VariableTypes.LIST_STRING:
      return 'text list';
    case VariableTypes.LIST_COLOUR:
      return 'color list';
    default:
      return 'list';
  }
};

const createVariable = (
  block: BlockData,
  variables: VariableData[],
  type: VariableTypes
): Variable => {
  const variableId = findFieldValue(block, 'VAR');
  const size = +findFieldValue(block, 'SIZE');
  const variableFound = variables.find((v) => v.id === variableId);
  return {
    id: variableId,
    type,
    name: variableFound.name,
    value: _.range(0, size).map(() => null)
  };
};

export const createListNumberState: StateGenerator = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) =>
  createListState(
    VariableTypes.LIST_NUMBER,
    block,
    variables,
    timeline,
    previousState
  );
export const createListStringState: StateGenerator = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) =>
  createListState(
    VariableTypes.LIST_STRING,
    block,
    variables,
    timeline,
    previousState
  );
export const createListBoolState: StateGenerator = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) =>
  createListState(
    VariableTypes.LIST_BOOLEAN,
    block,
    variables,
    timeline,
    previousState
  );
export const createListColorState: StateGenerator = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) =>
  createListState(
    VariableTypes.LIST_COLOUR,
    block,
    variables,
    timeline,
    previousState
  );
