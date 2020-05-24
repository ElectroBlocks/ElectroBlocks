import { BlockEvent } from '../blockly/dto/event.type';
import {
  ArduinoFrame,
  Timeline,
  ArduinoComponentType,
  ArduinoComponentState,
  SENSOR_COMPONENTS,
} from './arduino.frame';
import { BlockType, BlockData } from '../blockly/dto/block.type';
import { generateFrame } from './transformer/block-to-frame.transformer';
import _ from 'lodash';
import {
  getLoopTimeFromBlockData,
  findArduinoLoopBlock,
} from '../blockly/helpers/block-data.helper';
import { generateInputState } from './transformer/frame-transformer.helpers';
import { PinState, PIN_TYPE } from './arduino-components.state';
import {
  sensorSetupBlockName,
  convertToState,
} from '../blockly/transformers/sensor-data.transformer';

export const eventToFrameFactory = (event: BlockEvent): ArduinoFrame[] => {
  const { blocks } = event;

  const preSetupBlockType = [
    BlockType.SENSOR_SETUP,
    BlockType.SETUP,
    BlockType.LIST_CREATE,
  ];

  const preSetupBlocks = blocks.filter((b) =>
    preSetupBlockType.includes(b.type)
  );

  const preSetupStates = preSetupBlocks.reduce((prevStates, block) => {
    const previousState =
      prevStates.length === 0
        ? undefined
        : _.cloneDeep(prevStates[prevStates.length - 1]);

    return [
      ...prevStates,
      ...generateFrame(
        blocks,
        block,
        event.variables,
        { iteration: 0, function: 'pre-setup' },
        previousState
      ),
    ];
  }, []);

  const arduinoLoopBlock = findArduinoLoopBlock(blocks);
  const loopTimes = getLoopTimeFromBlockData(blocks);
  return _.range(1, loopTimes + 1).reduce((prevStates, loopTime) => {
    const timeLine: Timeline = { iteration: loopTime, function: 'loop' };
    const previousState = _.isEmpty(prevStates)
      ? undefined
      : prevStates[prevStates.length - 1];

    return [
      ...prevStates,
      ...generateInputState(
        arduinoLoopBlock,
        blocks,
        event.variables,
        timeLine,
        'loop',
        getPreviousState(blocks, timeLine, previousState)
      ),
    ];
  }, preSetupStates);
};

const getPreviousState = (
  blocks: BlockData[],
  timeline: Timeline,
  previousState: ArduinoFrame = undefined
): ArduinoFrame => {
  if (previousState === undefined) {
    return undefined;
  }

  const nonSensorComponent = (previousState as ArduinoFrame).components.filter(
    (c) => !isSensorComponent(c)
  );
  const sensorSetupBlocks = blocks.filter((b) =>
    sensorSetupBlockName.includes(b.blockName)
  );
  const newComponents = [
    ...nonSensorComponent,
    ...sensorSetupBlocks.map((b) => convertToState(b, timeline)),
  ];
  return { ...previousState, components: newComponents };
};

const isSensorComponent = (component: ArduinoComponentState) => {
  {
    if (
      ArduinoComponentType.PIN == component.type &&
      [PIN_TYPE.ANALOG_INPUT, PIN_TYPE.DIGITAL_INPUT].includes(
        (component as PinState).pinType
      )
    ) {
      return true;
    }

    return SENSOR_COMPONENTS.includes(component.type);
  }
};
