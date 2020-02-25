import 'jest';
import '../../../../blockly/blocks';
import Blockly, { Workspace, BlockSvg, WorkspaceSvg, Blocks } from 'blockly';
import {
  getAllBlocks,
  getBlockById
} from '../../../../blockly/helpers/block.helper';
import _ from 'lodash';
import { BlockEvent } from '../../../../blockly/state/event.data';
import { transformBlock } from '../../../../blockly/transformers/block.transformer';
import { getAllVariables } from '../../../../blockly/helpers/variable.helper';
import { transformVariable } from '../../../../blockly/transformers/variables.transformer';
import { eventToFrameFactory } from '../../../event-to-frame.factory';
import { ARDUINO_UNO_PINS } from '../../../../../constants/arduino';
import { saveSensorSetupBlockData } from '../../../../blockly/actions/factories/saveSensorSetupBlockData';
import { updater } from '../../../../blockly/updater';
import {
  ArduinoState,
  ArduinoComponentType
} from '../../../state/arduino.state';
import {
  RfidState,
  BluetoothState,
  ArduinoMessageState
} from '../../../state/arduino-components.state';
import { createArduinoAndWorkSpace } from '../../../../../tests/tests.helper';
import { BluetoothSensor } from '../../../../blockly/state/sensors.state';

describe('arduino message state factories', () => {
  let workspace: Workspace;
  let messageSetup;

  afterEach(() => {
    workspace.dispose();
  });

  beforeEach(() => {
    [workspace] = createArduinoAndWorkSpace();
    messageSetup = workspace.newBlock('message_setup');

    messageSetup.setFieldValue('TRUE', 'receiving_message');
    messageSetup.setFieldValue('hello world', 'message');

    const event: BlockEvent = {
      blocks: getAllBlocks().map(transformBlock),
      variables: getAllVariables().map(transformVariable),
      type: Blockly.Events.BLOCK_MOVE,
      blockId: messageSetup.id
    };
    saveSensorSetupBlockData(event).forEach(updater);
  });

  test('should be able generate state for message setup block', () => {
    const event: BlockEvent = {
      blocks: getAllBlocks().map(transformBlock),
      variables: getAllVariables().map(transformVariable),
      type: Blockly.Events.BLOCK_MOVE,
      blockId: messageSetup.id
    };

    const message: ArduinoMessageState = {
      pins: [],
      hasMessage: true,
      message: 'hello world',
      sendMessage: '',
      type: ArduinoComponentType.MESSAGE
    };

    const state: ArduinoState = {
      blockId: messageSetup.id,
      timeLine: { function: 'pre-setup', iteration: 0 },
      explanation: 'Setting up Arduino messages.',
      components: [message],
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
