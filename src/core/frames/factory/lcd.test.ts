import '../../blockly/blocks';
import Blockly, { Workspace, BlockSvg, WorkspaceSvg, Blocks } from 'blockly';
import { getAllBlocks, getBlockById } from '../../blockly/helpers/block.helper';
import _ from 'lodash';
import { BlockEvent } from '../../blockly/state/event.data';
import { transformBlock } from '../../blockly/transformers/block.transformer';
import { getAllVariables } from '../../blockly/helpers/variable.helper';
import { transformVariable } from '../../blockly/transformers/variables.transformer';
import { eventToFrameFactory } from '../event-to-frame.factory';
import { ARDUINO_UNO_PINS } from '../../../constants/arduino';
import { saveSensorSetupBlockData } from '../../blockly/actions/factories/saveSensorSetupBlockData';
import { updater } from '../../blockly/updater';
import { ArduinoState, ArduinoComponentType } from '../state/arduino.state';
import { TimeState, LCDScreenState, LCD_SCREEN_MEMORY_TYPE } from '../state/arduino-components.state';
import { createArduinoAndWorkSpace } from '../../../tests/tests.helper';

describe('lcd  factories', () => {
  let workspace: Workspace;
  let lcdsetup;

  afterEach(() => {
    workspace.dispose();
  });

  beforeEach(() => {
    [workspace] = createArduinoAndWorkSpace();
    lcdsetup = workspace.newBlock('lcd_setup');

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
      blink: {row: 0, column: 0, blinking: false},
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

});
