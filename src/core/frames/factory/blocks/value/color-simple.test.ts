import 'jest';
import '../../../../blockly/blocks';
import {
  createArduinoAndWorkSpace,
  createSetVariableBlockWithValue,
  verifyVariable
} from '../../../../../tests/tests.helper';
import '../../../../../tests/fake-block';
import Blockly, { Workspace, BlockSvg } from 'blockly';
import { VariableTypes } from '../../../../blockly/state/variable.data';
import { BlockEvent } from '../../../../blockly/state/event.data';
import {
  getAllBlocks,
  connectToArduinoBlock
} from '../../../../blockly/helpers/block.helper';
import { transformBlock } from '../../../../blockly/transformers/block.transformer';
import { getAllVariables } from '../../../../blockly/helpers/variable.helper';
import { transformVariable } from '../../../../blockly/transformers/variables.transformer';
import { eventToFrameFactory } from '../../../event-to-frame.factory';
import _ from 'lodash';
import { Color } from '../../../state/arduino.state';

describe('simple color state factories', () => {
  let workspace: Workspace;
  let arduinoBlock: BlockSvg;

  afterEach(() => {
    workspace.dispose();
  });

  beforeEach(() => {
    [workspace, arduinoBlock] = createArduinoAndWorkSpace();
  });

  test('test color picker block gives the right rgb value', () => {
    const colorPickerVariable = createSetVariableBlockWithValue(
      workspace,
      'color_test',
      VariableTypes.COLOUR,
      '#5ce693'
    );
    connectToArduinoBlock(colorPickerVariable);

    const event: BlockEvent = {
      blocks: getAllBlocks().map(transformBlock),
      variables: getAllVariables().map(transformVariable),
      type: Blockly.Events.BLOCK_MOVE,
      blockId: colorPickerVariable.id
    };
    const [state1event1] = eventToFrameFactory(event);

    expect(state1event1.explanation).toBe(
      'Variable "color_test" stores [red=92,green=230,blue=147].'
    );
    verifyVariable(
      'color_test',
      VariableTypes.COLOUR,
      { red: 92, green: 230, blue: 147 },
      state1event1.variables
    );

    const randomColorBlock = workspace.newBlock('colour_random');
    colorPickerVariable
      .getInput('VALUE')
      .connection.targetBlock()
      .dispose(true);
    colorPickerVariable
      .getInput('VALUE')
      .connection.connect(randomColorBlock.outputConnection);

    const event2: BlockEvent = {
      blocks: getAllBlocks().map(transformBlock),
      variables: getAllVariables().map(transformVariable),
      type: Blockly.Events.BLOCK_MOVE,
      blockId: colorPickerVariable.id
    };
    const [state1event2] = eventToFrameFactory(event2);

    expect(state1event1.explanation).toContain(
      'Variable "color_test" stores [red='
    );
    const color = state1event2.variables['color_test'].value as Color;
    expect(color).toBeDefined();
    expect(color.blue > 0).toBeTruthy();
    expect(color.red > 0).toBeTruthy();
    expect(color.green > 0).toBeTruthy();
  });
});
