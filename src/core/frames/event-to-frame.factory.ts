import { BlockEvent } from '../blockly/state/event.data';
import { ArduinoState } from './state/arduino.state';
import { Sensor } from '../blockly/state/sensors.state';
import { BlockType } from '../blockly/state/block.data';
import { generateState } from './factory/state.factories';
import _ from 'lodash';

export const eventToFrameFactory = (event: BlockEvent): ArduinoState[] => {
  const { blocks } = event;

  const preSetupBlockType = [
    BlockType.SENSOR_SETUP,
    BlockType.SETUP,
    BlockType.LIST_CREATE
  ];

  const preSetupBlocks = blocks.filter((b) =>
    preSetupBlockType.includes(b.type)
  );

  const setupFrames = preSetupBlocks.reduce((prevStates, block) => {
    const previousState =
      prevStates.length === 0
        ? undefined
        : _.cloneDeep(prevStates[prevStates.length - 1]);
    
    return [
      ...prevStates,
      ...generateState(
        blocks,
        block,
        event.variables,
        { iteration: 0, function: 'pre-setup' },
        previousState
      )
    ];
  }, []);

  return setupFrames;
};
