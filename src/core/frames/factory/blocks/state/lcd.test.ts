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
import { findComponent } from '../../factory.helpers';

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
      rowsOfText: [
        '                    ',
        '                    ',
        '                    ',
        '                    '
      ],
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
      'WORLDWORLDWORLDWORLD12345'
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

    const [state1, state2, state3] = eventToFrameFactory(event);
    const lcdState = state2.components.find(
      (c) => c.type === ArduinoComponentType.LCD_SCREEN
    ) as LCDScreenState;
    expect(state2.explanation).toBe('Printing message for 3.00 seconds.');
    expect(state2.delay).toBe(3000);
    expect(lcdState.rowsOfText[0]).toBe('HELLO               '); // ADDS THE SPACE
    expect(lcdState.rowsOfText[1]).toBe('WORLDWORLDWORLDWORLD'); // CUTS OFF THE 12345
    expect(lcdState.rowsOfText[2]).toBe('                    ');
    expect(lcdState.rowsOfText[3]).toBe('                    ');

    const lcdState2 = state3.components.find(
      (c) => c.type === ArduinoComponentType.LCD_SCREEN
    ) as LCDScreenState;

    expect(state3.explanation).toBe('Clearing the screen.');
    expect(state3.delay).toBe(0);
    expect(lcdState2.rowsOfText[0]).toBe('                    ');
    expect(lcdState2.rowsOfText[1]).toBe('                    ');
    expect(lcdState2.rowsOfText[2]).toBe('                    ');
    expect(lcdState2.rowsOfText[3]).toBe('                    ');
  });

  test('should be able to move test to right and then to left', () => {
    arduinoBlock.setFieldValue('1', 'LOOP_TIMES');
    const textBlock = createValueBlock(
      workspace,
      VariableTypes.STRING,
      'HELLO   WORLD!!!'
    );
    const rowNumBlock = createValueBlock(workspace, VariableTypes.NUMBER, 1);

    const colNumBlock = createValueBlock(workspace, VariableTypes.NUMBER, 1);

    const printBlock = workspace.newBlock('lcd_screen_print') as BlockSvg;
    printBlock.getInput('PRINT').connection.connect(textBlock.outputConnection);
    printBlock.getInput('ROW').connection.connect(rowNumBlock.outputConnection);
    printBlock
      .getInput('COLUMN')
      .connection.connect(colNumBlock.outputConnection);

    const simpleForLoopRight = workspace.newBlock(
      'controls_repeat_ext'
    ) as BlockSvg;
    const numberOfTimesRightBlock = createValueBlock(
      workspace,
      VariableTypes.NUMBER,
      4
    );
    const lcdScrollRightBlock = workspace.newBlock('lcd_scroll');
    lcdScrollRightBlock.setFieldValue('RIGHT', 'DIR');
    simpleForLoopRight
      .getInput('DO')
      .connection.connect(lcdScrollRightBlock.previousConnection);
    simpleForLoopRight
      .getInput('TIMES')
      .connection.connect(numberOfTimesRightBlock.outputConnection);

    const simpleForLoopLeft = workspace.newBlock(
      'controls_repeat_ext'
    ) as BlockSvg;
    const numberOfTimesLeftBlock = createValueBlock(
      workspace,
      VariableTypes.NUMBER,
      4
    );
    const lcdScrollLeftBlock = workspace.newBlock('lcd_scroll');
    lcdScrollLeftBlock.setFieldValue('LEFT', 'DIR');
    simpleForLoopLeft
      .getInput('DO')
      .connection.connect(lcdScrollLeftBlock.previousConnection);
    simpleForLoopLeft
      .getInput('TIMES')
      .connection.connect(numberOfTimesLeftBlock.outputConnection);

    connectToArduinoBlock(printBlock);
    printBlock.nextConnection.connect(simpleForLoopRight.previousConnection);
    simpleForLoopRight.nextConnection.connect(
      simpleForLoopLeft.previousConnection
    );

    const event: BlockEvent = {
      blocks: getAllBlocks().map(transformBlock),
      variables: getAllVariables().map(transformVariable),
      type: Blockly.Events.BLOCK_MOVE,
      blockId: lcdsetup.id
    };

    const [
      setupLCDState,
      printBlockState,
      loopRight1State,
      moveRight1State,
      loopRight2State,
      moveRight2State,
      loopRight3State,
      moveRight3State,
      loopRight4State,
      moveRight4State,
      loopLeft1State,
      moveLeft1State,
      loopLeft2State,
      moveLeft2State,
      loopLeft3State,
      moveLeft3State,
      loopLeft4State,
      moveLeft4State
    ] = eventToFrameFactory(event);

    confirmScrollMove(
      printBlockState,
      printBlock.id,
      'HELLO   WORLD!!!    ',
      'Printing "HELLO   WORLD!!!" to the screen at position (1, 1).'
    );

    confirmScrollMove(
      moveRight1State,
      lcdScrollRightBlock.id,
      ' HELLO   WORLD!!!   ',
      'Scrolling text to the right.'
    );

    confirmScrollMove(
      moveRight2State,
      lcdScrollRightBlock.id,
      '  HELLO   WORLD!!!  ',
      'Scrolling text to the right.'
    );

    confirmScrollMove(
      moveRight3State,
      lcdScrollRightBlock.id,
      '   HELLO   WORLD!!! ',
      'Scrolling text to the right.'
    );

    confirmScrollMove(
      moveRight4State,
      lcdScrollRightBlock.id,
      '    HELLO   WORLD!!!',
      'Scrolling text to the right.'
    );

    confirmScrollMove(
      moveLeft1State,
      lcdScrollLeftBlock.id,
      '   HELLO   WORLD!!! ',
      'Scrolling text to the left.'
    );

    confirmScrollMove(
      moveLeft2State,
      lcdScrollLeftBlock.id,
      '  HELLO   WORLD!!!  ',
      'Scrolling text to the left.'
    );

    confirmScrollMove(
      moveLeft3State,
      lcdScrollLeftBlock.id,
      ' HELLO   WORLD!!!   ',
      'Scrolling text to the left.'
    );

    confirmScrollMove(
      moveLeft4State,
      lcdScrollLeftBlock.id,
      'HELLO   WORLD!!!    ',
      'Scrolling text to the left.'
    );
  });

  test('test print block an row and column over flow', () => {});

  test('should be able to write over text with the print block', () => {});

  test('should be able to make the lcd blink and save the state', () => {});

  test('should be able to blink continously through the frames', () => {});

  test('should be able to clear everything off a screen', () => {});

  test('should be able to turn the back light on and off', () => {});

  const confirmScrollMove = (
    actualState: ArduinoState,
    blockId: string,
    row1Text: string,
    explanationText: string
  ) => {
    const lcdComponent = findComponent<LCDScreenState>(
      actualState,
      ArduinoComponentType.LCD_SCREEN
    );
    expect(lcdComponent.rowsOfText[0]).toBe(row1Text);
    expect(actualState.blockId).toBe(blockId);
    expect(actualState.explanation).toBe(explanationText);
  };
});
