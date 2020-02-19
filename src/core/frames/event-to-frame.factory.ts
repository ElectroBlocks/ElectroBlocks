import { BlockEvent } from '../blockly/state/event.data';
import { ArduinoState } from './state/arduino.state';
import { Sensor } from '../blockly/state/sensors.state';
import { BlockType } from '../blockly/state/block.data';
import { generateState } from './factory/state.factories';

export const eventToFrameFactory = (event: BlockEvent): ArduinoState[] => {
  const { blocks } = event;
  const setupBlocks = blocks.filter(
    (b) => b.type === BlockType.SENSOR_SETUP || b.type === BlockType.SETUP
  );

  const setupFrames = setupBlocks.reduce((prevStates, block) => {
    const [previousState] = prevStates.reverse();
    return [
      ...prevStates,
      ...generateState(
        blocks,
        block,
        { iteration: 0, function: 'pre-setup' },
        previousState
      )
    ];
  }, []);

  return setupFrames;
};
