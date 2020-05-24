import {
  VariableTypes,
  VariableData,
} from '../../../../blockly/state/variable.data';
import { BlockData } from '../../../../blockly/state/block.data';
import { Timeline, ArduinoFrame, Color } from '../../../arduino.frame';
import { ValueGenerator, getInputValue } from '../../value.factories';
import _ from 'lodash';
import { findFieldValue } from '../../../../blockly/helpers/block-data.helper';

export const getItemInList = (
  blocks: BlockData[],
  block: BlockData,
  variables: VariableData[],
  timeline: Timeline,
  previousState: ArduinoFrame = undefined
) => {
  const variableName = variables.find(
    (v) => v.id === findFieldValue(block, 'VAR')
  ).name;

  const currentValue = _.cloneDeep([
    ...(previousState.variables[variableName].value as
      | string[]
      | Color[]
      | boolean[]
      | number[]),
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

  return currentValue[position];
};
