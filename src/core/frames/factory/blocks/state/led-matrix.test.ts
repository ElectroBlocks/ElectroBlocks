import '../../../../blockly/blocks';
import Blockly, { Workspace, BlockSvg } from 'blockly';
import {
  getAllBlocks,
  connectToArduinoBlock,
} from '../../../../blockly/helpers/block.helper';
import _ from 'lodash';
import { BlockEvent } from '../../../../blockly/state/event.data';
import { transformBlock } from '../../../../blockly/transformers/block.transformer';
import { getAllVariables } from '../../../../blockly/helpers/variable.helper';
import { transformVariable } from '../../../../blockly/transformers/variables.transformer';
import { eventToFrameFactory } from '../../../event-to-frame.factory';
import { ARDUINO_UNO_PINS } from '../../../../../constants/arduino';
import { ArduinoComponentType } from '../../../arduino.frame';
import { LedMatrixState } from '../../../state/arduino-components.state';
import {
  createArduinoAndWorkSpace,
  createValueBlock,
} from '../../../../../tests/tests.helper';
import '../../../../../tests/fake-block';
import { findComponent } from '../../factory.helpers';
import { VariableTypes } from '../../../../blockly/state/variable.data';

describe('led matrix  factories', () => {
  let workspace: Workspace;

  afterEach(() => {
    workspace.dispose();
  });

  beforeEach(() => {
    [workspace] = createArduinoAndWorkSpace();
  });

  test('should be able to draw with the led and should be limited', () => {
    const ledmatrixdraw1 = workspace.newBlock(
      'led_matrix_make_draw'
    ) as BlockSvg;
    ledmatrixdraw1.setFieldValue('TRUE', '1,1');
    ledmatrixdraw1.setFieldValue('TRUE', '2,2');
    ledmatrixdraw1.setFieldValue('TRUE', '3,3');

    const ledmatrixdraw2 = workspace.newBlock(
      'led_matrix_make_draw'
    ) as BlockSvg;

    ledmatrixdraw2.setFieldValue('TRUE', '8,8');
    ledmatrixdraw2.setFieldValue('TRUE', '7,7');
    ledmatrixdraw2.setFieldValue('TRUE', '6,6');

    connectToArduinoBlock(ledmatrixdraw1);
    ledmatrixdraw1.nextConnection.connect(ledmatrixdraw2.previousConnection);

    const event: BlockEvent = {
      blocks: getAllBlocks().map(transformBlock),
      variables: getAllVariables().map(transformVariable),
      type: Blockly.Events.BLOCK_MOVE,
      blockId: ledmatrixdraw1.id,
    };

    const [state1, state2] = eventToFrameFactory(event);

    expect(state1.explanation).toBe('Drawing on LED Matrix.');
    expect(state2.explanation).toBe('Drawing on LED Matrix.');

    const component1 = findComponent<LedMatrixState>(
      state1,
      ArduinoComponentType.LED_MATRIX
    );
    component1.leds.forEach((led) => {
      if (led.col === led.row && [1, 2, 3].includes(led.row)) {
        expect(led.isOn).toBeTruthy();
        return;
      }
      expect(led.isOn).toBeFalsy();
    });

    const component2 = findComponent<LedMatrixState>(
      state2,
      ArduinoComponentType.LED_MATRIX
    );

    component2.leds.forEach((led) => {
      if (led.col === led.row && [6, 7, 8].includes(led.row)) {
        expect(led.isOn).toBeTruthy();
        return;
      }
      expect(led.isOn).toBeFalsy();
    });

    expect(component1.leds.length).toBe(64);
    expect(component2.leds.length).toBe(64);

    expect(component1.type).toBe(ArduinoComponentType.LED_MATRIX);
    expect(component1.pins.sort()).toEqual(
      [
        ARDUINO_UNO_PINS.PIN_10,
        ARDUINO_UNO_PINS.PIN_11,
        ARDUINO_UNO_PINS.PIN_12,
      ].sort()
    );

    expect(state1.components.length).toBe(1);
    expect(state2.components.length).toBe(1);
  });

  test('should be able to keep the state when using single led', () => {
    const ledMatrix1 = createLedMatrixBlock(1, 1, true);
    const ledMatrix2 = createLedMatrixBlock(2, 2, true);
    const ledMatrix3 = createLedMatrixBlock(1, 1, false);

    connectToArduinoBlock(ledMatrix1);
    ledMatrix1.nextConnection.connect(ledMatrix2.previousConnection);
    ledMatrix2.nextConnection.connect(ledMatrix3.previousConnection);

    const event: BlockEvent = {
      blocks: getAllBlocks().map(transformBlock),
      variables: getAllVariables().map(transformVariable),
      type: Blockly.Events.BLOCK_MOVE,
      blockId: ledMatrix2.id,
    };

    const [state1, state2, state3] = eventToFrameFactory(event);

    expect(state1.explanation).toBe('Led Matrix turn (1,1) on.');
    expect(state2.explanation).toBe('Led Matrix turn (2,2) on.');
    expect(state3.explanation).toBe('Led Matrix turn (1,1) off.');

    expect(state1.components.length).toBe(1);
    expect(state2.components.length).toBe(1);
    expect(state3.components.length).toBe(1);

    const component1 = state1.components[0] as LedMatrixState;
    component1.leds.forEach((led) => {
      if (led.row === 1 && led.col === 1) {
        expect(led.isOn).toBeTruthy();
        return;
      }
      expect(led.isOn).toBeFalsy();
    });

    const component2 = state2.components[0] as LedMatrixState;
    component2.leds.forEach((led) => {
      if (led.row === led.col && [1, 2].includes(led.col)) {
        expect(led.isOn).toBeTruthy();
        return;
      }
      expect(led.isOn).toBeFalsy();
    });

    const component3 = state3.components[0] as LedMatrixState;
    component3.leds.forEach((led) => {
      if (led.row === 2 && led.col === 2) {
        expect(led.isOn).toBeTruthy();
        return;
      }
      expect(led.isOn).toBeFalsy();
    });
  });

  const createLedMatrixBlock = (row: number, col: number, isOn) => {
    const ledMatrix = workspace.newBlock(
      'led_matrix_turn_one_on_off'
    ) as BlockSvg;

    const rowBlock = createValueBlock(workspace, VariableTypes.NUMBER, row);
    const colBlock = createValueBlock(workspace, VariableTypes.NUMBER, col);

    ledMatrix.getInput('ROW').connection.connect(rowBlock.outputConnection);
    ledMatrix.getInput('COLUMN').connection.connect(colBlock.outputConnection);

    ledMatrix.setFieldValue(isOn ? 'ON' : 'OFF', 'STATE');

    return ledMatrix as BlockSvg;
  };
});
