import 'jest';
import '../../../blockly/blocks';
import Blockly, { Workspace, BlockSvg, WorkspaceSvg, Blocks } from 'blockly';
import {
  getAllBlocks,
  getBlockById,
} from '../../../blockly/helpers/block.helper';
import _ from 'lodash';
import { BlockEvent } from '../../../blockly/dto/event.type';
import { transformBlock } from '../../../blockly/transformers/block.transformer';
import { getAllVariables } from '../../../blockly/helpers/variable.helper';
import { transformVariable } from '../../../blockly/transformers/variables.transformer';
import { saveSensorSetupBlockData } from '../../../blockly/actions/factories/saveSensorSetupBlockData';
import { updater } from '../../../blockly/updater';
import { createArduinoAndWorkSpace } from '../../../../tests/tests.helper';
import {
  UltraSonicSensorState,
  TemperatureState,
} from '../../arduino-components.state';
import { eventToFrameFactory } from '../../event-to-frame.factory';
import { ArduinoFrame, ArduinoComponentType } from '../../arduino.frame';
import { ARDUINO_UNO_PINS } from '../../../blockly/selectBoard';
import { TempSensor } from '../../../blockly/dto/sensors.type';

describe('rfid state factories', () => {
  let workspace: Workspace;
  let tempBlock;

  afterEach(() => {
    workspace.dispose();
  });

  beforeEach(() => {
    [workspace] = createArduinoAndWorkSpace();
    tempBlock = workspace.newBlock('temp_setup') as BlockSvg;
    tempBlock.setFieldValue('70', 'humidity');
    tempBlock.setFieldValue('50', 'temp');
    tempBlock.setFieldValue(ARDUINO_UNO_PINS.PIN_8, 'PIN');

    const event: BlockEvent = {
      blocks: getAllBlocks().map(transformBlock),
      variables: getAllVariables().map(transformVariable),
      type: Blockly.Events.BLOCK_MOVE,
      blockId: tempBlock.id,
    };
    saveSensorSetupBlockData(event).forEach(updater);
  });

  test('should be able generate state for temp sesnor setup block', () => {
    const event: BlockEvent = {
      blocks: getAllBlocks().map(transformBlock),
      variables: getAllVariables().map(transformVariable),
      type: Blockly.Events.BLOCK_MOVE,
      blockId: tempBlock.id,
    };

    const tempSensorState: TemperatureState = {
      pins: [ARDUINO_UNO_PINS.PIN_8],
      temperature: 50,
      humidity: 70,
      type: ArduinoComponentType.TEMPERATURE_SENSOR,
    };

    const state: ArduinoFrame = {
      blockId: tempBlock.id,
      blockName: 'temp_setup',
      timeLine: { function: 'pre-setup', iteration: 0 },
      explanation: 'Setting up temperature sensor.',
      components: [tempSensorState],
      variables: {},
      txLedOn: false,
      builtInLedOn: false,
      sendMessage: '', // message arduino is sending
      delay: 0, // Number of milliseconds to delay
      powerLedOn: true,
    };

    expect(eventToFrameFactory(event)).toEqual([state]);
  });
});
