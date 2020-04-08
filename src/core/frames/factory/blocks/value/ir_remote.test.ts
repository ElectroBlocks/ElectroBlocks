import 'jest';
import '../../../../blockly/blocks';
import Blockly, { Workspace, BlockSvg, WorkspaceSvg, Blocks } from 'blockly';
import {
  getAllBlocks,
  connectToArduinoBlock,
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
  createSetVariableBlockWithValue,
} from '../../../../../tests/tests.helper';
import {
  ButtonState,
  IRRemoteState,
} from '../../../state/arduino-components.state';
import { eventToFrameFactory } from '../../../event-to-frame.factory';
import {
  ArduinoState,
  ArduinoComponentType,
} from '../../../state/arduino.state';
import { ARDUINO_UNO_PINS } from '../../../../../constants/arduino';
import { VariableTypes } from '../../../../blockly/state/variable.data';
import { findComponent } from '../../factory.helpers';
import { irRemoteSetup } from '../state/ir_remote';

describe('button state factories', () => {
  let workspace: Workspace;

  afterEach(() => {
    workspace.dispose();
  });

  beforeEach(() => {
    [workspace] = createArduinoAndWorkSpace();
  });

  it('should be able generate state for ir remote read setup block', () => {
    const irRemoteSetup = workspace.newBlock('ir_remote_setup') as BlockSvg;
    setSetupBlock(1, true, 'code_1', irRemoteSetup);
    setSetupBlock(2, false, '', irRemoteSetup);
    setSetupBlock(3, true, 'code_3', irRemoteSetup);
    const hasCodeBlock = workspace.newBlock('ir_remote_has_code_receive');
    const getCodeBlock = workspace.newBlock('ir_remote_get_code');
    const varHasCodeBlock = createSetVariableBlockWithValue(
      workspace,
      'has_code',
      VariableTypes.BOOLEAN,
      true
    );

    varHasCodeBlock.getInput('VALUE').connection.targetBlock().dispose(true);
    varHasCodeBlock
      .getInput('VALUE')
      .connection.connect(hasCodeBlock.outputConnection);

    const varCodeBlock = createSetVariableBlockWithValue(
      workspace,
      'code',
      VariableTypes.STRING,
      true
    );

    varCodeBlock.getInput('VALUE').connection.targetBlock().dispose(true);
    varCodeBlock
      .getInput('VALUE')
      .connection.connect(getCodeBlock.outputConnection);

    connectToArduinoBlock(varHasCodeBlock);
    varHasCodeBlock.nextConnection.connect(varCodeBlock.previousConnection);

    const event: BlockEvent = {
      blocks: getAllBlocks().map(transformBlock),
      variables: getAllVariables().map(transformVariable),
      type: Blockly.Events.BLOCK_MOVE,
      blockId: varCodeBlock.id,
    };

    const [
      setup,
      state1,
      state2,
      state3,
      state4,
      state5,
      state6,
    ] = eventToFrameFactory(event);

    expect(_.keys(state1.variables).length).toBe(1);
    expect(state1.variables['has_code'].value).toBeTruthy();
    verifyComponent(state1, 'code_1', true);

    verifyVariables(state2, 'code_1', true);
    verifyComponent(state2, 'code_1', true);

    verifyVariables(state3, 'code_1', false);
    verifyComponent(state3, '', false);

    verifyVariables(state4, '', false);
    verifyComponent(state4, '', false);

    verifyVariables(state5, '', true);
    verifyComponent(state5, 'code_3', true);

    verifyVariables(state6, 'code_3', true);
    verifyComponent(state6, 'code_3', true);
  });
});

const verifyVariables = (
  state: ArduinoState,
  code: string,
  hasCode: boolean
) => {
  expect(state.variables['has_code'].value).toBe(hasCode);
  expect(state.variables['code'].value).toBe(code);
};

const verifyComponent = (
  state: ArduinoState,
  code: string,
  hasCode: boolean
) => {
  const irRemoteState = findComponent<IRRemoteState>(
    state,
    ArduinoComponentType.IR_REMOTE
  );
  expect(irRemoteState.code).toBe(code);
  expect(irRemoteState.hasCode).toBe(hasCode);
};

const setSetupBlock = (
  loopNumber: number,
  scannedCode: boolean,
  code: string,
  setupBlock: BlockSvg
) => {
  setupBlock.setFieldValue(loopNumber.toString(), 'LOOP');
  setupBlock.setFieldValue(scannedCode ? 'TRUE' : 'FALSE', 'scanned_new_code');
  setupBlock.setFieldValue(code, 'code');

  saveSensorSetupBlockData({
    blocks: getAllBlocks().map(transformBlock),
    variables: getAllVariables().map(transformVariable),
    type: Blockly.Events.BLOCK_MOVE,
    blockId: setupBlock.id,
  }).forEach(updater);
};
