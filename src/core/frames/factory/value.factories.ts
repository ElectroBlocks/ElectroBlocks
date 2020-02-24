import { Timeline, ArduinoState } from '../state/arduino.state';
import { Color } from '../state/arduino.state';
import { BlockData } from '../../blockly/state/block.data';
import { mathNumber } from './blocks/math';
import { logicBoolean } from './blocks/logic';
import { text } from './blocks/text';
import { VariableData } from '../../blockly/state/variable.data';
import { colorPicker } from './blocks/colors';

export interface ValueGenerator {
  (
    blocks: BlockData[],
    currentBlock: BlockData,
    variables: VariableData[],
    timeline: Timeline,
    previousState?: ArduinoState
  ):
    | number
    | string
    | boolean
    | Color
    | number[]
    | string[]
    | boolean[]
    | Color[];
}

export const valueList: { [blockName: string]: ValueGenerator } = {
  math_number: mathNumber,
  logic_boolean: logicBoolean,
  text,
  colour_picker: colorPicker
};

export const getValue: ValueGenerator = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  try {
    return valueList[block.blockName](
      blocks,
      block,
      variables,
      timeline,
      previousState
    );
  } catch (e) {
    console.log(block);
    console.log(e);
    throw e;
  }
};
