import '../../../blockly/blocks';
import Blockly, { Workspace, BlockSvg } from 'blockly';
import {
  getAllBlocks,
  connectToArduinoBlock,
} from '../../../blockly/helpers/block.helper';
import _ from 'lodash';
import { BlockEvent } from '../../../blockly/dto/event.data';
import { transformBlock } from '../../../blockly/transformers/block.transformer';
import { getAllVariables } from '../../../blockly/helpers/variable.helper';
import { transformVariable } from '../../../blockly/transformers/variables.transformer';
import { eventToFrameFactory } from '../../event-to-frame.factory';
import { ARDUINO_UNO_PINS } from '../../../blockly/selectBoard';
import { ArduinoFrame, ArduinoComponentType } from '../../arduino.frame';
import { LedColorState } from '../../arduino-components.state';
import {
  createArduinoAndWorkSpace,
  createValueBlock,
} from '../../../../tests/tests.helper';
import { VariableTypes } from '../../../blockly/dto/variable.data';
import '../../../../tests/fake-block';

describe('lcd  factories', () => {
  let workspace: Workspace;
  let ledColorSetup: BlockSvg;

  afterEach(() => {
    workspace.dispose();
  });

  beforeEach(() => {
    [workspace] = createArduinoAndWorkSpace();
    ledColorSetup = workspace.newBlock('led_color_setup') as BlockSvg;
    ledColorSetup.setFieldValue('11-10-9', 'WIRE');
    ledColorSetup.setFieldValue('BUILT_IN', 'PICTURE_TYPE');
  });

  test('should be able generate state for led color setup block', () => {
    const event: BlockEvent = {
      blocks: getAllBlocks().map(transformBlock),
      variables: getAllVariables().map(transformVariable),
      type: Blockly.Events.BLOCK_MOVE,
      blockId: ledColorSetup.id,
    };

    const ledColorState: LedColorState = {
      pins: [
        ARDUINO_UNO_PINS.PIN_11,
        ARDUINO_UNO_PINS.PIN_10,
        ARDUINO_UNO_PINS.PIN_9,
      ],
      redPin: ARDUINO_UNO_PINS.PIN_11,
      greenPin: ARDUINO_UNO_PINS.PIN_10,
      bluePin: ARDUINO_UNO_PINS.PIN_9,
      pictureType: 'BUILT_IN',
      color: { green: 0, red: 0, blue: 0 },
      type: ArduinoComponentType.LED_COLOR,
    };

    const state: ArduinoFrame = {
      blockId: ledColorSetup.id,
      timeLine: { function: 'pre-setup', iteration: 0 },
      explanation: 'Setting up color led.',
      components: [ledColorState],
      variables: {},
      txLedOn: false,
      rxLedOn: false,
      sendMessage: '', // message arduino is sending
      delay: 0, // Number of milliseconds to delay
      powerLedOn: true,
    };

    expect(eventToFrameFactory(event)).toEqual([state]);
  });

  test('should be able to change color the led', () => {
    ledColorSetup.setFieldValue('BREADBOARD', 'PICTURE_TYPE');
    const color1 = createValueBlock(workspace, VariableTypes.COLOUR, {
      red: 200,
      blue: 0,
      green: 200,
    });

    const color2 = createValueBlock(workspace, VariableTypes.COLOUR, {
      red: 200,
      blue: 100,
      green: 0,
    });

    const setColorBlock1 = workspace.newBlock('set_color_led') as BlockSvg;
    const setColorBlock2 = workspace.newBlock('set_color_led');
    setColorBlock1
      .getInput('COLOUR')
      .connection.connect(color1.outputConnection);
    setColorBlock2
      .getInput('COLOUR')
      .connection.connect(color2.outputConnection);

    connectToArduinoBlock(setColorBlock1);
    setColorBlock1.nextConnection.connect(setColorBlock2.previousConnection);

    const event: BlockEvent = {
      blocks: getAllBlocks().map(transformBlock),
      variables: getAllVariables().map(transformVariable),
      type: Blockly.Events.BLOCK_MOVE,
      blockId: ledColorSetup.id,
    };

    const [state1, state2, state3] = eventToFrameFactory(event);

    expect(state2.explanation).toBe(
      'Setting led color to [red=200,green=200,blue=0].'
    );

    expect(state2.components.length).toBe(1);
    const [component2] = state2.components as LedColorState[];
    expect(component2.pictureType).toBe('BREADBOARD');
    expect(component2.color).toEqual({ red: 200, green: 200, blue: 0 });

    expect(state3.explanation).toBe(
      'Setting led color to [red=200,green=0,blue=100].'
    );

    expect(state3.components.length).toBe(1);
    const [component3] = state3.components as LedColorState[];
    expect(component3.pictureType).toBe('BREADBOARD');
    expect(component3.color).toEqual({ red: 200, green: 0, blue: 100 });
  });
});
