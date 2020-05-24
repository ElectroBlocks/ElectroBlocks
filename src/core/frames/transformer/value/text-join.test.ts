import 'jest';
import '../../../blockly/blocks';
import {
  createArduinoAndWorkSpace,
  createSetVariableBlockWithValue,
} from '../../../../tests/tests.helper';
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

describe('text_join state factories', () => {
  let workspace: Workspace;
  let arduinoBlock: BlockSvg;

  afterEach(() => {
    workspace.dispose();
  });

  beforeEach(() => {
    [workspace, arduinoBlock] = createArduinoAndWorkSpace();
  });

  test('should be able to join text blocks and variable string together', () => {
    const textJoinBlock = workspace.newBlock('text_join') as BlockSvg;
    (textJoinBlock as any).itemCount_ = 3;
    (textJoinBlock as any).updateShape_();

    const stringVariableBlock = createSetVariableBlockWithValue(
      workspace,
      'usb_word',
      VariableTypes.STRING,
      '3.434.34'
    );

    const getVariableTextBlock = workspace.newBlock('variables_get_string');
    getVariableTextBlock.setFieldValue(
      stringVariableBlock.getFieldValue('VAR'),
      'VAR'
    );

    const textBlock1 = workspace.newBlock('text');
    textBlock1.setFieldValue('*', 'TEXT');

    const textBlock2 = workspace.newBlock('text');
    textBlock2.setFieldValue('*', 'TEXT');

    textJoinBlock
      .getInput('ADD0')
      .connection.connect(textBlock1.outputConnection);

    textJoinBlock
      .getInput('ADD1')
      .connection.connect(getVariableTextBlock.outputConnection);

    textJoinBlock
      .getInput('ADD2')
      .connection.connect(textBlock2.outputConnection);

    const variableStringTest = workspace.createVariable(
      'test_string',
      'String'
    );
    const setStringVariableBlock = workspace.newBlock(
      'variables_set_string'
    ) as BlockSvg;
    setStringVariableBlock.setFieldValue(variableStringTest.getId(), 'VAR');
    setStringVariableBlock
      .getInput('VALUE')
      .connection.connect(textJoinBlock.outputConnection);
    connectToArduinoBlock(setStringVariableBlock);
    connectToArduinoBlock(stringVariableBlock);

    const event: BlockEvent = {
      blocks: getAllBlocks().map(transformBlock),
      variables: getAllVariables().map(transformVariable),
      type: Blockly.Events.BLOCK_MOVE,
      blockId: setStringVariableBlock.id,
    };
    const [state1, state2] = eventToFrameFactory(event);

    expect(state1.explanation).toBe('Variable "usb_word" stores "3.434.34".');
    expect(state2.explanation).toBe(
      'Variable "test_string" stores "*3.434.34*".'
    );
    expect(state2.variables['test_string'].value).toBe('*3.434.34*');
  });

  test('should return an empty string if nothing is connected to it.', () => {
    const textJoinBlock = workspace.newBlock('text_join') as BlockSvg;
    (textJoinBlock as any).itemCount_ = 3;
    (textJoinBlock as any).updateShape_();
    const variableStringTest = workspace.createVariable(
      'test_string',
      'String'
    );
    const setStringVariableBlock = workspace.newBlock(
      'variables_set_string'
    ) as BlockSvg;
    setStringVariableBlock.setFieldValue(variableStringTest.getId(), 'VAR');
    setStringVariableBlock
      .getInput('VALUE')
      .connection.connect(textJoinBlock.outputConnection);
    connectToArduinoBlock(setStringVariableBlock);

    const event: BlockEvent = {
      blocks: getAllBlocks().map(transformBlock),
      variables: getAllVariables().map(transformVariable),
      type: Blockly.Events.BLOCK_MOVE,
      blockId: setStringVariableBlock.id,
    };
    const [state1] = eventToFrameFactory(event);
    expect(state1.explanation).toBe('Variable "test_string" stores "".');
    expect(state1.variables['test_string'].value).toBe('');
  });
});
