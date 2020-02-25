import 'jest';
import '../../../blockly/blocks';
import Blockly, { Workspace, BlockSvg, WorkspaceSvg, Blocks } from 'blockly';
import {
  getAllBlocks,
  getBlockById
} from '../../../blockly/helpers/block.helper';
import _ from 'lodash';
import { BlockEvent } from '../../../blockly/state/event.data';
import { transformBlock } from '../../../blockly/transformers/block.transformer';
import { getAllVariables } from '../../../blockly/helpers/variable.helper';
import { transformVariable } from '../../../blockly/transformers/variables.transformer';
import { saveSensorSetupBlockData } from '../../../blockly/actions/factories/saveSensorSetupBlockData';
import { updater } from '../../../blockly/updater';
import { createArduinoAndWorkSpace } from '../../../../tests/tests.helper';
import { ButtonState } from '../../state/arduino-components.state';
import { eventToFrameFactory } from '../../event-to-frame.factory';
import { ArduinoState, ArduinoComponentType } from '../../state/arduino.state';
import { ARDUINO_UNO_PINS } from '../../../../constants/arduino';

describe('button state factories', () => {
  let workspace: Workspace;
  let buttonSetup;

  afterEach(() => {
    workspace.dispose();
  });

  beforeEach(() => {
    [workspace] = createArduinoAndWorkSpace();
    buttonSetup = workspace.newBlock('button_setup') as BlockSvg;
    buttonSetup.setFieldValue('3', 'PIN');
    buttonSetup.setFieldValue(true, 'is_pressed');

    const event: BlockEvent = {
      blocks: getAllBlocks().map(transformBlock),
      variables: getAllVariables().map(transformVariable),
      type: Blockly.Events.BLOCK_MOVE,
      blockId: buttonSetup.id
    };
    saveSensorSetupBlockData(event).forEach(updater);
  });

  test('should be able generate state for button setup block', () => {
    const event: BlockEvent = {
      blocks: getAllBlocks().map(transformBlock),
      variables: getAllVariables().map(transformVariable),
      type: Blockly.Events.BLOCK_MOVE,
      blockId: buttonSetup.id
    };

    const buttonState: ButtonState = {
      isPressed: true,
      pins: [ARDUINO_UNO_PINS.PIN_3],
      type: ArduinoComponentType.BUTTON
    };

    const state: ArduinoState = {
      blockId: buttonSetup.id,
      timeLine: { function: 'pre-setup', iteration: 0 },
      explanation: 'button 3 is being setup.',
      components: [buttonState],
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
