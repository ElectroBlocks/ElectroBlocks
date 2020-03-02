import { StateGenerator } from '../../state.factories';
import {
  ArduinoState,
  Variable,
  Timeline,
  Color
} from '../../../state/arduino.state';
import { findFieldValue } from '../../../../blockly/helpers/block-data.helper';
import { BlockData } from '../../../../blockly/state/block.data';
import {
  VariableTypes,
  VariableData
} from '../../../../blockly/state/variable.data';
import _ from 'lodash';
import {
  arduinoStateByVariable,
  valueToString,
  getDefaultValueList
} from '../../factory.helpers';
import { getInputValue } from '../../value.factories';

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

const setItemInList = (
  type: VariableTypes,
  blocks: BlockData[],
  block: BlockData,
  variables: VariableData[],
  timeline: Timeline,
  previousState: ArduinoState = undefined
): ArduinoState[] => {
  const variableName = variables.find(
    (v) => v.id === findFieldValue(block, 'VAR')
  ).name;

  const currentValue = _.cloneDeep([
    ...(previousState.variables[variableName].value as
      | string[]
      | Color[]
      | boolean[]
      | number[])
  ]) as string[] | Color[] | boolean[] | number[];
  let position: number = getInputValue(
    blocks,
    block,
    variables,
    timeline,
    'POSITION',
    1,
    previousState
  );

  position = position >= 1 ? position - 1 : 0;
  position = position < 0 ? 0 : position;
  position =
    position > currentValue.length - 1 ? currentValue.length - 1 : position;

  const value = getInputValue(
    blocks,
    block,
    variables,
    timeline,
    'VALUE',
    getDefaultValueList(type),
    previousState
  );
  currentValue[position] = value;

  const newVariable: Variable = {
    type: previousState.variables[variableName].type,
    value: _.cloneDeep(currentValue),
    name: previousState.variables[variableName].name,
    id: previousState.variables[variableName].id
  };

  const stringValue = valueToString(
    value,
    previousState.variables[variableName].type.replace(
      'List ',
      ''
    ) as VariableTypes
  );

  const explanation = `List "${
    newVariable.name
  }" stores ${stringValue} at position ${position + 1}.`;

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

export const setStringInList: StateGenerator = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) =>
  setItemInList(
    VariableTypes.STRING,
    blocks,
    block,
    variables,
    timeline,
    previousState
  );

export const setBooleanInList: StateGenerator = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) =>
  setItemInList(
    VariableTypes.BOOLEAN,
    blocks,
    block,
    variables,
    timeline,
    previousState
  );

export const setNumberInList: StateGenerator = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) =>
  setItemInList(
    VariableTypes.NUMBER,
    blocks,
    block,
    variables,
    timeline,
    previousState
  );

export const setColorInList: StateGenerator = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) =>
  setItemInList(
    VariableTypes.COLOUR,
    blocks,
    block,
    variables,
    timeline,
    previousState
  );

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
