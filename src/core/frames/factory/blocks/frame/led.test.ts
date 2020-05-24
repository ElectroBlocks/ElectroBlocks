import '../../../../blockly/blocks';
import Blockly, { Workspace, BlockSvg } from 'blockly';
import {
  getAllBlocks,
  connectToArduinoBlock,
} from '../../../../blockly/helpers/block.helper';
import _ from 'lodash';
import { BlockEvent } from '../../../../blockly/dto/event.type';
import { transformBlock } from '../../../../blockly/transformers/block.transformer';
import { getAllVariables } from '../../../../blockly/helpers/variable.helper';
import { transformVariable } from '../../../../blockly/transformers/variables.transformer';
import { eventToFrameFactory } from '../../../event-to-frame.factory';
import { ARDUINO_UNO_PINS } from '../../../../blockly/selectBoard';
import { ArduinoFrame, ArduinoComponentType } from '../../../arduino.frame';
import {
  LedColorState,
  PinState,
  PinPicture,
} from '../../../arduino-components.state';
import {
  createArduinoAndWorkSpace,
  createValueBlock,
} from '../../../../../tests/tests.helper';
import { findComponent } from '../../factory.helpers';
import { VariableTypes } from '../../../../blockly/dto/variable.type';

describe('lcd  factories', () => {
  let workspace: Workspace;
  let arduinoBlock: BlockSvg;

  afterEach(() => {
    workspace.dispose();
  });

  beforeEach(() => {
    [workspace, arduinoBlock] = createArduinoAndWorkSpace();
  });

  test('should be able to turn on and off and leds', () => {
    testDigitalWriteBlocks('led', PinPicture.LED);
  });

  test('should be able to turn on and off and pins', () => {
    testDigitalWriteBlocks('digital_write', PinPicture.LED_DIGITAL_WRITE);
  });

  test('should be able to analog write to a pin', () => {
    testAnalogWriteBlocks('led_fade', 'FADE', PinPicture.LED);
  });

  test('should be able to fade an led', () => {
    testAnalogWriteBlocks(
      'analog_write',
      'WRITE_VALUE',
      PinPicture.LED_ANALOG_WRITE
    );
  });

  const testAnalogWriteBlocks = (
    blockType: string,
    numberBlockConnection: string,
    pinPicture: PinPicture
  ) => {
    arduinoBlock.setFieldValue('1', 'LOOP_TIMES');
    const pinWord = pinPicture == PinPicture.LED ? 'led' : 'pin';

    const led5Block1 = createAnalogBlock(
      20,
      blockType,
      ARDUINO_UNO_PINS.PIN_5,
      numberBlockConnection
    );

    const led10Block1 = createAnalogBlock(
      39,
      blockType,
      ARDUINO_UNO_PINS.PIN_10,
      numberBlockConnection
    );

    const led5Block2 = createAnalogBlock(
      140,
      blockType,
      ARDUINO_UNO_PINS.PIN_5,
      numberBlockConnection
    );

    const led10Block2 = createAnalogBlock(
      123,
      blockType,
      ARDUINO_UNO_PINS.PIN_10,
      numberBlockConnection
    );

    connectToArduinoBlock(led5Block1);
    led5Block1.nextConnection.connect(led10Block1.previousConnection);
    led10Block1.nextConnection.connect(led5Block2.previousConnection);
    led5Block2.nextConnection.connect(led10Block2.previousConnection);

    const event: BlockEvent = {
      blocks: getAllBlocks().map(transformBlock),
      variables: getAllVariables().map(transformVariable),
      type: Blockly.Events.BLOCK_MOVE,
      blockId: led10Block2.id,
    };

    const [state1, state2, state3, state4] = eventToFrameFactory(event);
    const pin4State1 = state1.components[0] as PinState;

    expect(state1.explanation).toBe(
      `Setting ${pinWord} 5${pinWord == 'led' ? ' to fade' : ''} to 20.`
    );
    expect(pin4State1.pinPicture).toBe(pinPicture);
    expect(pin4State1.state).toBe(20);
    expect(pin4State1.pin).toBe(ARDUINO_UNO_PINS.PIN_5);

    verifyState(
      20,
      39,
      state2,
      `Setting ${pinWord} 10${pinWord == 'led' ? ' to fade' : ''} to 39.`,
      pinPicture
    );
    verifyState(
      140,
      39,
      state3,
      `Setting ${pinWord} 5${pinWord == 'led' ? ' to fade' : ''} to 140.`,
      pinPicture
    );
    verifyState(
      140,
      123,
      state4,
      `Setting ${pinWord} 10${pinWord == 'led' ? ' to fade' : ''} to 123.`,
      pinPicture
    );
  };

  const testDigitalWriteBlocks = (
    blockType: string,
    pinPicture: PinPicture
  ) => {
    const pinWord = pinPicture == PinPicture.LED ? 'led' : 'pin';
    arduinoBlock.setFieldValue('1', 'LOOP_TIMES');
    const ledPin5On = workspace.newBlock(blockType) as BlockSvg;
    ledPin5On.setFieldValue('5', 'PIN');
    ledPin5On.setFieldValue('ON', 'STATE');

    const ledPin5Off = workspace.newBlock(blockType) as BlockSvg;
    ledPin5Off.setFieldValue('5', 'PIN');
    ledPin5Off.setFieldValue('OFF', 'STATE');

    const ledPin10On = workspace.newBlock(blockType) as BlockSvg;
    ledPin10On.setFieldValue('10', 'PIN');
    ledPin10On.setFieldValue('ON', 'STATE');

    const ledPin10Off = workspace.newBlock(blockType) as BlockSvg;
    ledPin10Off.setFieldValue('10', 'PIN');
    ledPin10Off.setFieldValue('OFF', 'STATE');

    connectToArduinoBlock(ledPin5On);
    ledPin5On.nextConnection.connect(ledPin10On.previousConnection);
    ledPin10On.nextConnection.connect(ledPin10Off.previousConnection);
    ledPin10Off.nextConnection.connect(ledPin5Off.previousConnection);

    const event: BlockEvent = {
      blocks: getAllBlocks().map(transformBlock),
      variables: getAllVariables().map(transformVariable),
      type: Blockly.Events.BLOCK_MOVE,
      blockId: ledPin10Off.id,
    };

    const [state1, state2, state3, state4] = eventToFrameFactory(event);

    const pin5State1 = state1.components[0] as PinState;

    expect(state1.explanation).toBe(`Turn ${pinWord} 5 on.`);
    expect(pin5State1.pinPicture).toBe(pinPicture);
    expect(pin5State1.state).toBe(1);
    expect(pin5State1.pin).toBe(ARDUINO_UNO_PINS.PIN_5);

    verifyState(1, 1, state2, `Turn ${pinWord} 10 on.`, pinPicture);
    verifyState(1, 0, state3, `Turn ${pinWord} 10 off.`, pinPicture);
    verifyState(0, 0, state4, `Turn ${pinWord} 5 off.`, pinPicture);
  };

  const verifyState = (
    pin5On: number,
    pin10On: number,
    state: ArduinoFrame,
    explanation: string,
    pictureType: PinPicture
  ) => {
    const led4State = findComponent<PinState>(
      state,
      ArduinoComponentType.PIN,
      ARDUINO_UNO_PINS.PIN_5
    );

    const led10State = findComponent<PinState>(
      state,
      ArduinoComponentType.PIN,
      ARDUINO_UNO_PINS.PIN_10
    );

    expect(state.explanation).toBe(explanation);

    expect(led4State.pinPicture).toBe(pictureType);
    expect(led4State.state).toBe(pin5On);
    expect(led4State.pin).toBe(ARDUINO_UNO_PINS.PIN_5);

    expect(led10State.pinPicture).toBe(pictureType);
    expect(led10State.state).toBe(pin10On);
    expect(led10State.pin).toBe(ARDUINO_UNO_PINS.PIN_10);
  };

  const createAnalogBlock = (
    writeValue: number,
    blockType: string,
    pin: ARDUINO_UNO_PINS,
    connectionName: string
  ) => {
    const valueBlock = createValueBlock(
      workspace,
      VariableTypes.NUMBER,
      writeValue
    );

    const analogBlock = workspace.newBlock(blockType) as BlockSvg;
    analogBlock.setFieldValue(pin.toString(), 'PIN');
    analogBlock
      .getInput(connectionName)
      .connection.connect(valueBlock.outputConnection);

    return analogBlock;
  };
});
