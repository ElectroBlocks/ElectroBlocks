import 'jest';
import '../../../../blockly/blocks';
import {
  createArduinoAndWorkSpace,
  createSetVariableBlockWithValue
} from '../../../../../tests/tests.helper';
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

describe('number_to_string state factories', () => {
  let workspace: Workspace;
  let arduinoBlock: BlockSvg;

  afterEach(() => {
    workspace.dispose();
  });

  beforeEach(() => {
    [workspace, arduinoBlock] = createArduinoAndWorkSpace();
  });

  test('should be able be able change a number variable/text block/empty to a text', () => {
    const numberToTextBlock = workspace.newBlock('number_to_string');
    numberToTextBlock.setFieldValue('3', 'PRECISION');

    const numberBlock = workspace.newBlock('math_number');
    numberBlock.setFieldValue('93.999323', 'NUM');

    numberToTextBlock
      .getInput('NUMBER')
      .connection.connect(numberBlock.outputConnection);

    const setTextBlock = createSetVariableBlockWithValue(
      workspace,
      'text_test',
      VariableTypes.STRING,
      ''
    );
    const textBlockToRemove = setTextBlock
      .getInput('VALUE')
      .connection.targetBlock();
    textBlockToRemove.dispose(true);

    setTextBlock
      .getInput('VALUE')
      .connection.connect(numberToTextBlock.outputConnection);

    connectToArduinoBlock(setTextBlock);

    const event1: BlockEvent = {
      blocks: getAllBlocks().map(transformBlock),
      variables: getAllVariables().map(transformVariable),
      type: Blockly.Events.BLOCK_MOVE,
      blockId: numberToTextBlock.id
    };

    const [state1Event1] = eventToFrameFactory(event1);

    expect(state1Event1.explanation).toBe(
      'Variable "text_test" stores "93.999".'
    );
    expect(state1Event1.variables['text_test'].value).toBe('93.999');

    numberBlock.dispose(true);

    const setNumberVariable = createSetVariableBlockWithValue(
      workspace,
      'num',
      VariableTypes.NUMBER,
      '333.33399'
    );

    connectToArduinoBlock(setNumberVariable);

    const getNumberVariable = workspace.newBlock('variables_get_number');
    getNumberVariable.setFieldValue(
      setNumberVariable.getFieldValue('VAR'),
      'VAR'
    );

    numberToTextBlock
      .getInput('NUMBER')
      .connection.connect(getNumberVariable.outputConnection);

    const event2: BlockEvent = {
      blocks: getAllBlocks().map(transformBlock),
      variables: getAllVariables().map(transformVariable),
      type: Blockly.Events.BLOCK_MOVE,
      blockId: numberToTextBlock.id
    };

    const [state1Event2, state2Event2] = eventToFrameFactory(event2);

    expect(state2Event2.explanation).toBe(
      'Variable "text_test" stores "333.334".'
    );
    expect(state2Event2.variables['text_test'].value).toBe('333.334');

    getNumberVariable.dispose(true);
    setNumberVariable.dispose(true);

    const event3: BlockEvent = {
      blocks: getAllBlocks().map(transformBlock),
      variables: getAllVariables().map(transformVariable),
      type: Blockly.Events.BLOCK_MOVE,
      blockId: numberToTextBlock.id
    };

    const [state1Event3] = eventToFrameFactory(event3);

    expect(state1Event3.explanation).toBe(
      'Variable "text_test" stores "0.000".'
    );
    expect(state1Event3.variables['text_test'].value).toBe('0.000');
  });
});
