import 'jest';
import '../../../../blockly/blocks';
import Blockly, { Workspace, BlockSvg, WorkspaceSvg, Blocks } from 'blockly';
import {
  getAllBlocks,
  getBlockById,
  connectToArduinoBlock,
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
import { ArduinoFrame, ArduinoComponentType } from '../../../arduino.frame';
import {
  createArduinoAndWorkSpace,
  createSetVariableBlockWithValue,
} from '../../../../../tests/tests.helper';
import {
  PinState,
  PIN_TYPE,
  PinPicture,
} from '../../../arduino-components.state';
import { VariableTypes } from '../../../../blockly/state/variable.data';
import { getDefaultValue } from '../../factory.helpers';

describe('analog pin state factories', () => {
  let workspace: Workspace;
  let analogReadSetup;
  let digitalReadSetup1;

  afterEach(() => {
    workspace.dispose();
  });

  beforeEach(() => {
    [workspace] = createArduinoAndWorkSpace();
  });

  test('should be able digital pins', () => {
    runTest(
      workspace,
      'digital_read_setup',
      'digital_read',
      'has_power',
      VariableTypes.BOOLEAN,
      ARDUINO_UNO_PINS.PIN_6,
      PinPicture.SENSOR,
      [1, 0],
      ARDUINO_UNO_PINS.PIN_9,
      PinPicture.TOUCH_SENSOR,
      [0, 1]
    );
  });

  test('should be able to get analog read', () => {
    runTest(
      workspace,
      'analog_read_setup',
      'analog_read',
      'power_level',
      VariableTypes.NUMBER,
      ARDUINO_UNO_PINS.PIN_A0,
      PinPicture.PHOTO_SENSOR,
      [30, 53],
      ARDUINO_UNO_PINS.PIN_A1,
      PinPicture.SOIL_SENSOR,
      [43, 212]
    );
  });
});

const runTest = (
  workspace: Workspace,
  setupBlockType: string,
  sensorReadBlockType: string,
  sensorStateField: string,
  variableType: VariableTypes,
  block1Pin: ARDUINO_UNO_PINS,
  block1PictureType: PinPicture,
  block1State: [number, number],
  block2Pin: ARDUINO_UNO_PINS,
  block2PictureType: PinPicture,
  block2State: [number, number]
) => {
  const setupBlock1 = workspace.newBlock(setupBlockType) as BlockSvg;
  setupBlock1.setFieldValue(block1Pin, 'PIN');
  setupBlock1.setFieldValue(block1PictureType, 'TYPE');
  setupBlock1.setFieldValue(block1State[0].toString(), sensorStateField);

  const setupBlock2 = workspace.newBlock(setupBlockType) as BlockSvg;
  setupBlock2.setFieldValue(block2Pin, 'PIN');
  setupBlock2.setFieldValue(block2PictureType, 'TYPE');
  setupBlock2.setFieldValue(block2State[0].toString(), sensorStateField);

  saveSensorSetupBlockData({
    blocks: getAllBlocks().map(transformBlock),
    variables: getAllVariables().map(transformVariable),
    type: Blockly.Events.BLOCK_MOVE,
    blockId: setupBlock1.id,
  }).forEach(updater);
  saveSensorSetupBlockData({
    blocks: getAllBlocks().map(transformBlock),
    variables: getAllVariables().map(transformVariable),
    type: Blockly.Events.BLOCK_MOVE,
    blockId: setupBlock2.id,
  }).forEach(updater);

  setupBlock1.setFieldValue(block1State[1].toString(), sensorStateField);
  setupBlock2.setFieldValue(block2State[1].toString(), sensorStateField);

  saveSensorSetupBlockData({
    blocks: getAllBlocks().map(transformBlock),
    variables: getAllVariables().map(transformVariable),
    type: Blockly.Events.BLOCK_MOVE,
    blockId: setupBlock1.id,
  }).forEach(updater);
  saveSensorSetupBlockData({
    blocks: getAllBlocks().map(transformBlock),
    variables: getAllVariables().map(transformVariable),
    type: Blockly.Events.BLOCK_MOVE,
    blockId: setupBlock2.id,
  }).forEach(updater);

  const variable1Block = createSetVariableBlockWithValue(
    workspace,
    'block1',
    variableType,
    getDefaultValue(variableType)
  );

  const sensorBlock1 = workspace.newBlock(sensorReadBlockType) as BlockSvg;
  sensorBlock1.setFieldValue(block1Pin, 'PIN');

  const sensorBlock2 = workspace.newBlock(sensorReadBlockType) as BlockSvg;
  sensorBlock1.setFieldValue(block2Pin, 'PIN');

  variable1Block.getInput('VALUE').connection.targetBlock().dispose(true);
  variable1Block
    .getInput('VALUE')
    .connection.connect(sensorBlock1.outputConnection);

  const variable2Block = createSetVariableBlockWithValue(
    workspace,
    'block2',
    variableType,
    getDefaultValue(variableType)
  );
  variable2Block.getInput('VALUE').connection.targetBlock().dispose(true);
  variable1Block
    .getInput('VALUE')
    .connection.connect(sensorBlock2.outputConnection);

  connectToArduinoBlock(variable1Block);
  variable1Block.nextConnection.connect(variable2Block.previousConnection);

  const mainEvent = {
    blocks: getAllBlocks().map(transformBlock),
    variables: getAllVariables().map(transformVariable),
    type: Blockly.Events.BLOCK_MOVE,
    blockId: variable2Block.id,
  };

  const [setup1, setup2, state1, state2, state3, state4] = eventToFrameFactory(
    mainEvent
  );
};
