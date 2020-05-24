import 'jest';
import '../../../blockly/blocks';
import Blockly, { Workspace, BlockSvg, WorkspaceSvg, Blocks } from 'blockly';
import {
  getAllBlocks,
  getBlockById,
  connectToArduinoBlock,
} from '../../../blockly/helpers/block.helper';
import _ from 'lodash';
import { BlockEvent } from '../../../blockly/dto/event.data';
import { transformBlock } from '../../../blockly/transformers/block.transformer';
import { getAllVariables } from '../../../blockly/helpers/variable.helper';
import { transformVariable } from '../../../blockly/transformers/variables.transformer';
import { eventToFrameFactory } from '../../event-to-frame.factory';
import { ARDUINO_UNO_PINS } from '../../../blockly/selectBoard';
import { saveSensorSetupBlockData } from '../../../blockly/actions/factories/saveSensorSetupBlockData';
import { updater } from '../../../blockly/updater';
import { ArduinoFrame, ArduinoComponentType } from '../../arduino.frame';
import { ArduinoMessageState } from '../../arduino-components.state';
import {
  createArduinoAndWorkSpace,
  createValueBlock,
  createSetVariableBlockWithValue,
} from '../../../../tests/tests.helper';
import { BluetoothSensor } from '../../../blockly/dto/sensors.data';
import { VariableTypes } from '../../../blockly/dto/variable.data';
import { sensorSetupBlocks } from '../../../blockly/dto/block.data';

describe('arduino message state factories', () => {
  let workspace: Workspace;
  let messageSetup;
  let arduinoBlock: BlockSvg;

  afterEach(() => {
    workspace.dispose();
  });

  beforeEach(() => {
    [workspace, arduinoBlock] = createArduinoAndWorkSpace();
    arduinoBlock.setFieldValue('3', 'LOOP_TIMES');
    messageSetup = workspace.newBlock('message_setup');

    messageSetup.setFieldValue('1', 'LOOP');
    messageSetup.setFieldValue('TRUE', 'receiving_message');
    messageSetup.setFieldValue('one', 'message');

    const event: BlockEvent = {
      blocks: getAllBlocks().map(transformBlock),
      variables: getAllVariables().map(transformVariable),
      type: Blockly.Events.BLOCK_MOVE,
      blockId: messageSetup.id,
    };
    saveSensorSetupBlockData(event).forEach(updater);

    messageSetup.setFieldValue('2', 'LOOP');
    messageSetup.setFieldValue('TRUE', 'receiving_message');
    messageSetup.setFieldValue('two', 'message');

    const event2: BlockEvent = {
      blocks: getAllBlocks().map(transformBlock),
      variables: getAllVariables().map(transformVariable),
      type: Blockly.Events.BLOCK_MOVE,
      blockId: messageSetup.id,
    };
    saveSensorSetupBlockData(event2).forEach(updater);

    messageSetup.setFieldValue('3', 'LOOP');
    messageSetup.setFieldValue('FALSE', 'receiving_message');

    const event3: BlockEvent = {
      blocks: getAllBlocks().map(transformBlock),
      variables: getAllVariables().map(transformVariable),
      type: Blockly.Events.BLOCK_MOVE,
      blockId: messageSetup.id,
    };
    saveSensorSetupBlockData(event3).forEach(updater);
  });

  test('should be to get the text message being sent', () => {
    const textVariableBlock = createSetVariableBlockWithValue(
      workspace,
      'text',
      VariableTypes.STRING,
      'blue'
    );
    textVariableBlock.getInput('VALUE').connection.targetBlock().dispose(true);

    const getMessageBlock = workspace.newBlock('arduino_get_message');
    textVariableBlock
      .getInput('VALUE')
      .connection.connect(getMessageBlock.outputConnection);

    connectToArduinoBlock(textVariableBlock);
    const event: BlockEvent = {
      blocks: getAllBlocks().map(transformBlock),
      variables: getAllVariables().map(transformVariable),
      type: Blockly.Events.BLOCK_MOVE,
      blockId: textVariableBlock.id,
    };

    const [state1, state2, state3, state4] = eventToFrameFactory(event);
    expect(state2.variables['text'].value).toBe('one');
    expect(state3.variables['text'].value).toBe('two');
    expect(state4.variables['text'].value).toBe('');
  });

  test('should be able to see if the arduino is recieving a message', () => {
    const boolVariableBlock = createSetVariableBlockWithValue(
      workspace,
      'has_message',
      VariableTypes.BOOLEAN,
      'blue'
    );
    boolVariableBlock.getInput('VALUE').connection.targetBlock().dispose(true);

    const getMessageBlock = workspace.newBlock('arduino_receive_message');
    boolVariableBlock
      .getInput('VALUE')
      .connection.connect(getMessageBlock.outputConnection);

    connectToArduinoBlock(boolVariableBlock);
    const event: BlockEvent = {
      blocks: getAllBlocks().map(transformBlock),
      variables: getAllVariables().map(transformVariable),
      type: Blockly.Events.BLOCK_MOVE,
      blockId: boolVariableBlock.id,
    };

    const [state1, state2, state3, state4] = eventToFrameFactory(event);
    expect(state2.variables['has_message'].value).toBeTruthy();
    expect(state3.variables['has_message'].value).toBeTruthy();
    expect(state4.variables['has_message'].value).toBeFalsy();
  });
});
