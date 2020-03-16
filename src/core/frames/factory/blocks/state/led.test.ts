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
  LedColorState,
  PinState,
  PinPicture
} from '../../../state/arduino-components.state';
import { createArduinoAndWorkSpace } from '../../../../../tests/tests.helper';
import { findComponent } from '../../factory.helpers';

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
    arduinoBlock.setFieldValue('1', 'LOOP_TIMES');
    const ledPin4On = workspace.newBlock('led') as BlockSvg;
    ledPin4On.setFieldValue('4', 'PIN');
    ledPin4On.setFieldValue('ON', 'STATE');

    const ledPin4Off = workspace.newBlock('led') as BlockSvg;
    ledPin4Off.setFieldValue('4', 'PIN');
    ledPin4Off.setFieldValue('OFF', 'STATE');

    const ledPin10On = workspace.newBlock('led') as BlockSvg;
    ledPin10On.setFieldValue('10', 'PIN');
    ledPin10On.setFieldValue('ON', 'STATE');

    const ledPin10Off = workspace.newBlock('led') as BlockSvg;
    ledPin10Off.setFieldValue('10', 'PIN');
    ledPin10Off.setFieldValue('OFF', 'STATE');

    connectToArduinoBlock(ledPin4On);
    ledPin4On.nextConnection.connect(ledPin10On.previousConnection);
    ledPin10On.nextConnection.connect(ledPin10Off.previousConnection);
    ledPin10Off.nextConnection.connect(ledPin4Off.previousConnection);

    const event: BlockEvent = {
      blocks: getAllBlocks().map(transformBlock),
      variables: getAllVariables().map(transformVariable),
      type: Blockly.Events.BLOCK_MOVE,
      blockId: ledPin10Off.id
    };

    const [state1, state2, state3, state4] = eventToFrameFactory(event);

    const pin4State1 = state1.components[0] as PinState;

    expect(state1.explanation).toBe('Turn led 4 on.');
    expect(pin4State1.pinPicture).toBe(PinPicture.LED);
    expect(pin4State1.state).toBe(1);
    expect(pin4State1.pin).toBe(ARDUINO_UNO_PINS.PIN_4);

    verifyState(true, true, state2, 'Turn led 10 on.');
    verifyState(true, false, state3, 'Turn led 10 off.');
    verifyState(false, false, state4, 'Turn led 4 off.');
  });

  const verifyState = (
    pin4On: boolean,
    pin10On: boolean,
    state: ArduinoState,
    explanation: string
  ) => {
    const led4State = findComponent<PinState>(
      state,
      ArduinoComponentType.PIN,
      ARDUINO_UNO_PINS.PIN_4
    );

    const led10State = findComponent<PinState>(
      state,
      ArduinoComponentType.PIN,
      ARDUINO_UNO_PINS.PIN_10
    );

    expect(state.explanation).toBe(explanation);

    expect(led4State.pinPicture).toBe(PinPicture.LED);
    expect(led4State.state).toBe(pin4On ? 1 : 0);
    expect(led4State.pin).toBe(ARDUINO_UNO_PINS.PIN_4);

    expect(led10State.pinPicture).toBe(PinPicture.LED);
    expect(led10State.state).toBe(pin10On ? 1 : 0);
    expect(led10State.pin).toBe(ARDUINO_UNO_PINS.PIN_10);
  };
});
