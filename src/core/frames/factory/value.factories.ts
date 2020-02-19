import { Timeline, ArduinoState } from '../state/arduino.state';
import { Color } from '../state/arduino.state';
import { BlockData } from '../../blockly/state/block.data';

export interface ValueGenerator {
  (
    blocks: BlockData[],
    currentBlock: BlockData,
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

export const valueList: { [blockName: string]: ValueGenerator } = {};

