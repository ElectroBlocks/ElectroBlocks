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
import {
  ArduinoState,
  ArduinoComponentType
} from '../../../state/arduino.state';
import { TimeState } from '../../../state/arduino-components.state';
import {
  createArduinoAndWorkSpace,
  createSetVariableBlockWithValue
} from '../../../../../tests/tests.helper';
import { VariableTypes } from '../../../../blockly/state/variable.data';
describe('get time block factories', () => {
  let workspace: Workspace;
  let timesetup;
  let arduinoBlock: BlockSvg;

  afterEach(() => {
    workspace.dispose();
  });

  beforeEach(() => {
    [workspace, arduinoBlock] = createArduinoAndWorkSpace();
    timesetup = workspace.newBlock('time_setup');

    timesetup.setFieldValue('.3', 'time_in_seconds');
  });

  test('should be able generate state for time setup block', () => {
    arduinoBlock.setFieldValue('3', 'LOOP_TIMES');

    const numberVariableBlock = createSetVariableBlockWithValue(
      workspace,
      'seconds',
      VariableTypes.NUMBER,
      1
    );
    numberVariableBlock
      .getInput('VALUE')
      .connection.targetBlock()
      .dispose(true);

    const arduionBlockInSeconds = workspace.newBlock('time_seconds');
    numberVariableBlock
      .getInput('VALUE')
      .connection.connect(arduionBlockInSeconds.outputConnection);

    connectToArduinoBlock(numberVariableBlock);

    const event: BlockEvent = {
      blocks: getAllBlocks().map(transformBlock),
      variables: getAllVariables().map(transformVariable),
      type: Blockly.Events.BLOCK_MOVE,
      blockId: timesetup.id
    };

    const [state1, state2, state3, state4] = eventToFrameFactory(event);

    expect(state2.variables['seconds'].value).toBe(0.3);
    expect(state3.variables['seconds'].value).toBe(0.6);
    expect(state4.variables['seconds'].value).toBe(0.9);
  });
});
