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
import { eventToFrameFactory } from '../../../event-to-frame.factory';
import { ARDUINO_UNO_PINS } from '../../../../../constants/arduino';
import {
  ArduinoState,
  ArduinoComponentType
} from '../../../state/arduino.state';
import {
  LCDScreenState,
  LCD_SCREEN_MEMORY_TYPE
} from '../../../state/arduino-components.state';
import {
  createArduinoAndWorkSpace,
  createValueBlock
} from '../../../../../tests/tests.helper';
import { VariableTypes } from '../../../../blockly/state/variable.data';

describe('lcd  factories', () => {
  let workspace: Workspace;
  let lcdsetup: BlockSvg;
  let arduinoBlock: BlockSvg;

  afterEach(() => {
    workspace.dispose();
  });

  beforeEach(() => {
    [workspace, arduinoBlock] = createArduinoAndWorkSpace();
    lcdsetup = workspace.newBlock('lcd_setup') as BlockSvg;

    lcdsetup.setFieldValue('0x27', 'MEMORY_TYPE');
    lcdsetup.setFieldValue('20 x 4', 'SIZE');
  });

  test('should be able generate state for lcd setup block', () => {
    const event: BlockEvent = {
      blocks: getAllBlocks().map(transformBlock),
      variables: getAllVariables().map(transformVariable),
      type: Blockly.Events.BLOCK_MOVE,
      blockId: lcdsetup.id
    };

    const lcdState: LCDScreenState = {
      pins: [ARDUINO_UNO_PINS.PIN_A4, ARDUINO_UNO_PINS.PIN_A5],
      backLightOn: true,
      blink: { row: 0, column: 0, blinking: false },
      memoryType: LCD_SCREEN_MEMORY_TYPE['0X27'],
      rowsOfText: [],
      rows: 4,
      columns: 20,
      type: ArduinoComponentType.LCD_SCREEN
    };

    const state: ArduinoState = {
      blockId: lcdsetup.id,
      timeLine: { function: 'pre-setup', iteration: 0 },
      explanation: 'Setting up LCD Screen.',
      components: [lcdState],
      variables: {},
      txLedOn: false,
      rxLedOn: false,
      sendMessage: '', // message arduino is sending
      delay: 0, // Number of milliseconds to delay
      powerLedOn: true
    };

    expect(eventToFrameFactory(event)).toEqual([state]);
  });

  test('LCD Screen simple print should print something simple', () => {
    arduinoBlock.setFieldValue('1', 'LOOP_TIMES');
    const lcdPrintLCDBlock = workspace.newBlock(
      'lcd_screen_simple_print'
    ) as BlockSvg;

    const textRowBlock1 = createValueBlock(
      workspace,
      VariableTypes.STRING,
      'HELLO'
    );

    const textRowBlock2 = createValueBlock(
      workspace,
      VariableTypes.STRING,
      'WORLD'
    );

    const numBlock = createValueBlock(workspace, VariableTypes.NUMBER, 3);
    lcdPrintLCDBlock
      .getInput('ROW_1')
      .connection.connect(textRowBlock1.outputConnection);
    lcdPrintLCDBlock
      .getInput('ROW_2')
      .connection.connect(textRowBlock2.outputConnection);

    lcdPrintLCDBlock
      .getInput('DELAY')
      .connection.connect(numBlock.outputConnection);

    connectToArduinoBlock(lcdPrintLCDBlock);

    const event: BlockEvent = {
      blocks: getAllBlocks().map(transformBlock),
      variables: getAllVariables().map(transformVariable),
      type: Blockly.Events.BLOCK_MOVE,
      blockId: lcdsetup.id
    };

    const [state1, state2] = eventToFrameFactory(event);
    const lcdState = state2.components.find(
      (c) => c.type === ArduinoComponentType.LCD_SCREEN
    ) as LCDScreenState;
    expect(state2.explanation).toBe('Printing message for 3.00 seconds.');
    expect(state2.delay).toBe(3000);
    expect(lcdState.rowsOfText[0]).toBe('HELLO');
    expect(lcdState.rowsOfText[1]).toBe('WORLD');
    expect(lcdState.rowsOfText[2]).toBe('');
    expect(lcdState.rowsOfText[3]).toBe('');
  });
});
