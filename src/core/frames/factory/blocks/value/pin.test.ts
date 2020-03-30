import 'jest';
import '../../../../blockly/blocks';
import Blockly, { Workspace, BlockSvg, WorkspaceSvg, Blocks } from 'blockly';
import {
  getAllBlocks,
  getBlockById,
  connectToArduinoBlock
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
  createArduinoAndWorkSpace,
  createSetVariableBlockWithValue
} from '../../../../../tests/tests.helper';
import {
  PinState,
  PIN_TYPE,
  PinPicture
} from '../../../state/arduino-components.state';
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
    const event = runSetup(
      workspace,
      'digital_read_setup',
      'digital_read',
      VariableTypes.BOOLEAN,
      ARDUINO_UNO_PINS.PIN_6,
      PinPicture.SENSOR,
      [1, 0],
      ARDUINO_UNO_PINS.PIN_9,
      PinPicture.TOUCH_SENSOR,
      [0, 1]
    );
  });
});

const runSetup = (
  workspace: Workspace,
  blockType: string,
  sensorBlockType: string,
  variableType: VariableTypes,
  block1Pin: ARDUINO_UNO_PINS,
  block1PictureType: PinPicture,
  block1State: [number, number],
  block2Pin: ARDUINO_UNO_PINS,
  block2PictureType: PinPicture,
  block2State: [number, number]
) => {
  const block1 = workspace.newBlock(blockType) as BlockSvg;
  block1.setFieldValue(block1Pin, 'PIN');
  block1.setFieldValue(block1PictureType, 'TYPE');
  block1.setFieldValue(block1State[0].toString(), 'power_level');

  const block2 = workspace.newBlock(blockType) as BlockSvg;
  block2.setFieldValue(block2Pin, 'PIN');
  block2.setFieldValue(block2PictureType, 'TYPE');
  block2.setFieldValue(block2State[0].toString(), 'has_power');

  const event: BlockEvent = {
    blocks: getAllBlocks().map(transformBlock),
    variables: getAllVariables().map(transformVariable),
    type: Blockly.Events.BLOCK_MOVE,
    blockId: block2.id
  };

  saveSensorSetupBlockData(event).forEach(updater);

  block1.setFieldValue(block1State[1].toString(), 'power_level');
  block2.setFieldValue(block2State[1].toString(), 'has_power');

  const event2: BlockEvent = {
    blocks: getAllBlocks().map(transformBlock),
    variables: getAllVariables().map(transformVariable),
    type: Blockly.Events.BLOCK_MOVE,
    blockId: block2.id
  };

  saveSensorSetupBlockData(event2).forEach(updater);

  const variable1Block = createSetVariableBlockWithValue(
    workspace,
    'block1',
    variableType,
    getDefaultValue(variableType)
  );

  const sensorBlock1 = workspace.newBlock(sensorBlockType) as BlockSvg;
  sensorBlock1.setFieldValue(block1Pin, 'PIN');

  const sensorBlock2 = workspace.newBlock(sensorBlockType) as BlockSvg;
  sensorBlock1.setFieldValue(block2Pin, 'PIN');

  variable1Block
    .getInput('VALUE')
    .connection.targetBlock()
    .dispose(true);
  variable1Block
    .getInput('VALUE')
    .connection.connect(sensorBlock1.outputConnection);

  const variable2Block = createSetVariableBlockWithValue(
    workspace,
    'block2',
    variableType,
    getDefaultValue(variableType)
  );
  variable2Block
    .getInput('VALUE')
    .connection.targetBlock()
    .dispose(true);
  variable1Block
    .getInput('VALUE')
    .connection.connect(sensorBlock2.outputConnection);

  connectToArduinoBlock(variable1Block);
  variable1Block.nextConnection.connect(variable2Block.previousConnection);

  const mainEvent = {
    blocks: getAllBlocks().map(transformBlock),
    variables: getAllVariables().map(transformVariable),
    type: Blockly.Events.BLOCK_MOVE,
    blockId: variable2Block.id
  };

  const [setup1, setup2, state1, state2, state3, state4] = eventToFrameFactory(
    mainEvent
  );
};
