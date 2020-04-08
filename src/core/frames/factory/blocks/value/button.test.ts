import 'jest';
import '../../../../blockly/blocks';
import Blockly, { Workspace, BlockSvg } from 'blockly';
import {
  getAllBlocks,
  connectToArduinoBlock
} from '../../../../blockly/helpers/block.helper';
import _ from 'lodash';
import { BlockEvent } from '../../../../blockly/state/event.data';
import { transformBlock } from '../../../../blockly/transformers/block.transformer';
import { getAllVariables } from '../../../../blockly/helpers/variable.helper';
import { transformVariable } from '../../../../blockly/transformers/variables.transformer';
import { saveSensorSetupBlockData } from '../../../../blockly/actions/factories/saveSensorSetupBlockData';
import { updater } from '../../../../blockly/updater';
import {
  createArduinoAndWorkSpace,
  createSetVariableBlockWithValue
} from '../../../../../tests/tests.helper';
import { ButtonState } from '../../../state/arduino-components.state';
import { eventToFrameFactory } from '../../../event-to-frame.factory';
import {
  ArduinoState,
  ArduinoComponentType
} from '../../../state/arduino.state';
import { ARDUINO_UNO_PINS } from '../../../../../constants/arduino';
import { VARIABLE_TYPES } from '../../../../../constants/variables';
import { VariableTypes } from '../../../../blockly/state/variable.data';
import { findComponent } from '../../factory.helpers';

describe('button state factories', () => {
  let workspace: Workspace;
  let arduinoBlock: BlockSvg;
  afterEach(() => {
    workspace.dispose();
  });

  beforeEach(() => {
    [workspace, arduinoBlock] = createArduinoAndWorkSpace();
    arduinoBlock.setFieldValue('2', 'LOOP_TIMES');
  });

  test('should be able generate state for button setup block', () => {
    const buttonSetup1 = workspace.newBlock('button_setup') as BlockSvg;
    buttonSetup1.setFieldValue('3', 'PIN');
    buttonSetup1.setFieldValue('TRUE', 'is_pressed');

    const buttonSetup2 = workspace.newBlock('button_setup') as BlockSvg;
    buttonSetup2.setFieldValue('5', 'PIN');
    buttonSetup2.setFieldValue('FALSE', 'is_pressed');
    saveDebugData(buttonSetup1, buttonSetup2);

    buttonSetup1.setFieldValue('2', 'LOOP');
    buttonSetup2.setFieldValue('2', 'LOOP');
    buttonSetup2.setFieldValue('TRUE', 'is_pressed');
    buttonSetup1.setFieldValue('FALSE', 'is_pressed');
    saveDebugData(buttonSetup1, buttonSetup2);

    const setVariablePin3 = createSetVariableBlock(
      workspace,
      'block1',
      ARDUINO_UNO_PINS.PIN_3
    );

    const setVariablePin5 = createSetVariableBlock(
      workspace,
      'block2',
      ARDUINO_UNO_PINS.PIN_5
    );
    connectToArduinoBlock(setVariablePin3);
    setVariablePin3.nextConnection.connect(setVariablePin5.previousConnection);
    const event: BlockEvent = {
      blocks: getAllBlocks().map(transformBlock),
      variables: getAllVariables().map(transformVariable),
      type: Blockly.Events.BLOCK_MOVE,
      blockId: buttonSetup1.id
    };

    const [
      setup1,
      setup2,
      state1,
      state2,
      state3,
      state4
    ] = eventToFrameFactory(event);

    expect(state1.variables['block1'].value).toBeTruthy();
    verifyState(state1, true, false);
    verifyState(state2, true, false);
    verifyState(state3, false, true);
    verifyState(state4, false, true);
    verifyVariables(state2, true, false);
    verifyVariables(state3, false, false);
    verifyVariables(state4, false, true);
  });
});

const verifyVariables = (
  state: ArduinoState,
  block1Value: boolean,
  block2Value: boolean
) => {
  expect(state.variables['block1'].value).toBe(block1Value);
  expect(state.variables['block2'].value).toBe(block2Value);
};

const verifyState = (
  state: ArduinoState,
  pin3Pressed: boolean,
  pin5Pressed: boolean
) => {
  const buttonPin3 = findComponent<ButtonState>(
    state,
    ArduinoComponentType.BUTTON,
    ARDUINO_UNO_PINS.PIN_3
  );

  const buttonPin5 = findComponent<ButtonState>(
    state,
    ArduinoComponentType.BUTTON,
    ARDUINO_UNO_PINS.PIN_5
  );

  expect(buttonPin3.isPressed).toBe(pin3Pressed);
  expect(buttonPin5.isPressed).toBe(pin5Pressed);
};

const createSetVariableBlock = (
  workspace: Workspace,
  variableName: string,
  pin: ARDUINO_UNO_PINS
) => {
  const setBoolVariableBlock = createSetVariableBlockWithValue(
    workspace,
    variableName,
    VariableTypes.BOOLEAN,
    true
  );
  setBoolVariableBlock
    .getInput('VALUE')
    .connection.targetBlock()
    .dispose(true);

  const isButtonPressed = workspace.newBlock('is_button_pressed');
  isButtonPressed.setFieldValue(pin, 'PIN');
  setBoolVariableBlock
    .getInput('VALUE')
    .connection.connect(isButtonPressed.outputConnection);

  return setBoolVariableBlock;
};

const saveDebugData = (buttonSetup1: BlockSvg, buttonSetup2: BlockSvg) => {
  saveSensorSetupBlockData({
    blocks: getAllBlocks().map(transformBlock),
    variables: getAllVariables().map(transformVariable),
    type: Blockly.Events.BLOCK_MOVE,
    blockId: buttonSetup1.id
  }).forEach(updater);

  saveSensorSetupBlockData({
    blocks: getAllBlocks().map(transformBlock),
    variables: getAllVariables().map(transformVariable),
    type: Blockly.Events.BLOCK_MOVE,
    blockId: buttonSetup2.id
  }).forEach(updater);
};
