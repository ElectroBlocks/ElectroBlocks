import 'jest';
import '../../../blockly/blocks';
import {
  createArduinoAndWorkSpace,
  createSetVariableBlockWithValue,
  verifyVariable,
} from '../../../../tests/tests.helper';
import '../../../../tests/fake-block';
import Blockly, { Workspace, BlockSvg } from 'blockly';
import { VariableTypes } from '../../../blockly/dto/variable.type';
import { BlockEvent } from '../../../blockly/dto/event.type';
import {
  getAllBlocks,
  connectToArduinoBlock,
} from '../../../blockly/helpers/block.helper';
import { transformBlock } from '../../../blockly/transformers/block.transformer';
import { getAllVariables } from '../../../blockly/helpers/variable.helper';
import { transformVariable } from '../../../blockly/transformers/variables.transformer';
import { eventToFrameFactory } from '../../event-to-frame.factory';
import _ from 'lodash';
import { Color } from '../../arduino.frame';

describe('color rgb state factories', () => {
  let workspace: Workspace;
  let arduinoBlock: BlockSvg;

  afterEach(() => {
    workspace.dispose();
  });

  beforeEach(() => {
    [workspace, arduinoBlock] = createArduinoAndWorkSpace();
  });

  test('test rgb color block can handle variables, number blocks, and blanks', () => {
    const numberBlock = workspace.newBlock('math_number');
    const rgbColorBlock = workspace.newBlock('colour_rgb');
    numberBlock.setFieldValue('120', 'NUM');

    const setNumberVariable = createSetVariableBlockWithValue(
      workspace,
      'color',
      VariableTypes.NUMBER,
      100
    );

    const getVariableNumberBlock = workspace.newBlock('variables_get_number');
    getVariableNumberBlock.setFieldValue(
      setNumberVariable.getFieldValue('VAR'),
      'VAR'
    );

    const setColorVariable = createSetVariableBlockWithValue(
      workspace,
      'color_test',
      VariableTypes.COLOUR,
      { red: 255, green: 0, blue: 0 }
    );
    setColorVariable.getInput('VALUE').connection.targetBlock().dispose(true);
    setColorVariable
      .getInput('VALUE')
      .connection.connect(rgbColorBlock.outputConnection);

    connectToArduinoBlock(setColorVariable);
    connectToArduinoBlock(setNumberVariable);

    [
      {
        expectedValue: { red: 120, green: 100, blue: 0 },
        red: numberBlock,
        green: getVariableNumberBlock,
        blue: undefined,
      },
      {
        expectedValue: { red: 0, green: 100, blue: 120 },
        red: null,
        green: getVariableNumberBlock,
        blue: numberBlock,
      },
      {
        expectedValue: { red: 120, green: 0, blue: 100 },
        red: numberBlock,
        green: null,
        blue: getVariableNumberBlock,
      },
    ].forEach(({ red, green, blue, expectedValue }) => {
      if (rgbColorBlock.getInput('RED').connection.isConnected()) {
        rgbColorBlock.getInput('RED').connection.disconnect();
      }

      if (rgbColorBlock.getInput('GREEN').connection.isConnected()) {
        rgbColorBlock.getInput('GREEN').connection.disconnect();
      }

      if (rgbColorBlock.getInput('BLUE').connection.isConnected()) {
        rgbColorBlock.getInput('BLUE').connection.disconnect();
      }

      if (red) {
        rgbColorBlock.getInput('RED').connection.connect(red.outputConnection);
      }
      if (green) {
        rgbColorBlock
          .getInput('GREEN')
          .connection.connect(green.outputConnection);
      }
      if (blue) {
        rgbColorBlock
          .getInput('BLUE')
          .connection.connect(blue.outputConnection);
      }

      const event: BlockEvent = {
        blocks: getAllBlocks().map(transformBlock),
        variables: getAllVariables().map(transformVariable),
        type: Blockly.Events.BLOCK_MOVE,
        blockId: rgbColorBlock.id,
      };

      const [state1, state2] = eventToFrameFactory(event);
      expect(state2.explanation).toBe(
        `Variable "color_test" stores (red=${expectedValue.red},green=${expectedValue.green},blue=${expectedValue.blue}).`
      );
      expect(state2.variables['color_test'].value).toEqual(expectedValue);
    });
  });
});
