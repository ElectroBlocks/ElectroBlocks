import 'jest';
import '../../../blockly/blocks';
import Blockly, { Workspace, BlockSvg, WorkspaceSvg, Blocks } from 'blockly';
import { getAllBlocks, getBlockById } from '../../../blockly/helpers/block.helper';
import _ from 'lodash';
import { BlockEvent } from '../../../blockly/state/event.data';
import { transformBlock } from '../../../blockly/transformers/block.transformer';
import { getAllVariables } from '../../../blockly/helpers/variable.helper';
import { transformVariable } from '../../../blockly/transformers/variables.transformer';
import { eventToFrameFactory } from '../../event-to-frame.factory';
import { ARDUINO_UNO_PINS } from '../../../../constants/arduino';
import { saveSensorSetupBlockData } from '../../../blockly/actions/factories/saveSensorSetupBlockData';
import { updater } from '../../../blockly/updater';
import { ArduinoState, ArduinoComponentType } from '../../state/arduino.state';
import {  BluetoothState } from '../../state/arduino-components.state';
import { createArduinoAndWorkSpace } from '../../../../tests/tests.helper';


describe('bluetooth frame factories', () => {
  let workspace: Workspace;
  let bluethoothsetupblock;

  afterEach(() => {
    workspace.dispose();
  });

  beforeEach(() => {
    [workspace] = createArduinoAndWorkSpace();
    bluethoothsetupblock = workspace.newBlock('bluetooth_setup');
    bluethoothsetupblock.setFieldValue(ARDUINO_UNO_PINS.PIN_7, 'RX');
    bluethoothsetupblock.setFieldValue(ARDUINO_UNO_PINS.PIN_6, 'TX');

    bluethoothsetupblock.setFieldValue('TRUE', 'receiving_message');
    bluethoothsetupblock.setFieldValue('hello world', 'message');

    const event: BlockEvent = {
      blocks: getAllBlocks().map(transformBlock),
      variables: getAllVariables().map(transformVariable),
      type: Blockly.Events.BLOCK_MOVE,
      blockId: bluethoothsetupblock.id
    };
    saveSensorSetupBlockData(event).forEach(updater);

  });

  test('should be able generate state for bluetooth setup block', () => {
    const event: BlockEvent = {
      blocks: getAllBlocks().map(transformBlock),
      variables: getAllVariables().map(transformVariable),
      type: Blockly.Events.BLOCK_MOVE,
      blockId: bluethoothsetupblock.id
    };

    const btComponent: BluetoothState = {
      pins: [ARDUINO_UNO_PINS.PIN_7, ARDUINO_UNO_PINS.PIN_6],
      rxPin: ARDUINO_UNO_PINS.PIN_7,
      txPin: ARDUINO_UNO_PINS.PIN_6,
      hasMessage: true,
      message: 'hello world',
      sendMessage: '',
      type: ArduinoComponentType.BLUE_TOOTH
    };

    const state: ArduinoState = {
      blockId: bluethoothsetupblock.id,
      timeLine: { function: 'pre-setup', iteration: 0 },
      explanation: 'Setting up Bluetooth.',
      components: [btComponent],
      variables: {},
      txLedOn: false,
      rxLedOn: false,
      sendMessage: '', // message arduino is sending
      delay: 0, // Number of milliseconds to delay
      powerLedOn: true
    };

    expect(eventToFrameFactory(event)).toEqual([state]);
  });
});
