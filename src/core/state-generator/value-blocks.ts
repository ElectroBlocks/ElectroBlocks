import { BlockSvg } from 'blockly';
import { Timeline, ArduinoState } from '../arduino-state/arduino.state';
import { Color } from '../arduino-state/arduino.state';

export interface ValueGenerator {
  (block: BlockSvg, timeline: Timeline, previousState?: ArduinoState):
    | number
    | string
    | boolean
    | Color
    | number[]
    | string[]
    | boolean[]
    | Color[];
}

export const valueList: { [key: string]: ValueGenerator } = {};
