import 'jest';
import '../../../../blockly/blocks';
import Blockly, {
  Workspace,
  BlockSvg,
  WorkspaceSvg,
  Blocks,
  Block,
} from 'blockly';
import {
  getAllBlocks,
  getBlockById,
  connectToArduinoBlock,
} from '../../../../blockly/helpers/block.helper';
import _ from 'lodash';
import { BlockEvent } from '../../../../blockly/state/event.data';
import { transformBlock } from '../../../../blockly/transformers/block.transformer';
import { getAllVariables } from '../../../../blockly/helpers/variable.helper';
import { transformVariable } from '../../../../blockly/transformers/variables.transformer';
import { eventToFrameFactory } from '../../../event-to-frame.factory';
import { ARDUINO_UNO_PINS } from '../../../../../constants/arduino';
import { saveSensorSetupBlockData } from '../../../../blockly/actions/factories/saveSensorSetupBlockData';
import { updater } from '../../../../blockly/updater';
import { ArduinoFrame, ArduinoComponentType } from '../../../arduino.frame';
import { RfidState } from '../../../arduino-components.state';
import {
  createArduinoAndWorkSpace,
  createSetVariableBlockWithValue,
  createValueBlock,
} from '../../../../../tests/tests.helper';
import { VariableTypes } from '../../../../blockly/state/variable.data';
import { getDefaultValue, findComponent } from '../../factory.helpers';

describe('rfid value factories', () => {
  let workspace: Workspace;

  afterEach(() => {
    workspace.dispose();
  });

  beforeEach(() => {
    [workspace] = createArduinoAndWorkSpace();
  });

  test('should be able generate state for rfid setup block', () => {
    const setupBlock = workspace.newBlock('rfid_setup') as BlockSvg;

    const rfidHasScanCardBlock = workspace.newBlock('rfid_scan');
    const rfidCardNumberBlock = workspace.newBlock('rfid_card');
    const rfidTagBlock = workspace.newBlock('rfid_tag');

    setSetupBlock(1, true, 'card_1', 'tag_1', setupBlock);
    setSetupBlock(2, false, '', '', setupBlock);
    setSetupBlock(3, true, 'card_3', 'tag_3', setupBlock);

    const hasCardVarBlock = createVariableBlock(
      'has_card',
      VariableTypes.BOOLEAN,
      rfidHasScanCardBlock,
      workspace
    );

    const cardNumberVarBlock = createVariableBlock(
      'card_number',
      VariableTypes.STRING,
      rfidCardNumberBlock,
      workspace
    );

    const tagNumberVarBlock = createVariableBlock(
      'tag_number',
      VariableTypes.STRING,
      rfidTagBlock,
      workspace
    );

    connectToArduinoBlock(hasCardVarBlock);
    hasCardVarBlock.nextConnection.connect(
      cardNumberVarBlock.previousConnection
    );
    cardNumberVarBlock.nextConnection.connect(
      tagNumberVarBlock.previousConnection
    );

    const [
      setup,
      state1,
      state2,
      state3,
      state4,
      state5,
      state6,
      state7,
      state8,
      state9,
    ] = eventToFrameFactory({
      blocks: getAllBlocks().map(transformBlock),
      variables: getAllVariables().map(transformVariable),
      type: Blockly.Events.BLOCK_MOVE,
      blockId: setupBlock.id,
    });

    verifyComponent(state1, true, 'tag_1', 'card_1');
    verifyComponent(state2, true, 'tag_1', 'card_1');
    verifyComponent(state3, true, 'tag_1', 'card_1');
    verifyComponent(state4, false, '', '');
    verifyComponent(state5, false, '', '');
    verifyComponent(state6, false, '', '');
    verifyComponent(state7, true, 'tag_3', 'card_3');
    verifyComponent(state8, true, 'tag_3', 'card_3');
    verifyComponent(state9, true, 'tag_3', 'card_3');

    verifyVariables(state1, true, undefined, undefined);
    verifyVariables(state2, true, 'card_1', undefined);
    verifyVariables(state3, true, 'card_1', 'tag_1');

    verifyVariables(state4, false, 'card_1', 'tag_1');
    verifyVariables(state5, false, '', 'tag_1');
    verifyVariables(state6, false, '', '');

    verifyVariables(state7, true, '', '');
    verifyVariables(state8, true, 'card_3', '');
    verifyVariables(state9, true, 'card_3', 'tag_3');
  });
});

const verifyComponent = (
  state: ArduinoFrame,
  hasCard: boolean,
  tag: string,
  cardNumer: string
) => {
  const rfidState = findComponent<RfidState>(state, ArduinoComponentType.RFID);

  expect(rfidState.scannedCard).toBe(hasCard);
  expect(rfidState.tag).toBe(tag);
  expect(rfidState.cardNumber).toBe(cardNumer);
};

const verifyVariables = (
  state: ArduinoFrame,
  hasCard: boolean | undefined,
  cardNumber: string | undefined,
  tag: string | undefined
) => {
  if (hasCard !== undefined) {
    expect(state.variables['has_card'].value).toBe(hasCard);
  }

  if (tag !== undefined) {
    expect(state.variables['tag_number'].value).toBe(tag);
  }

  if (cardNumber !== undefined) {
    expect(state.variables['card_number'].value).toBe(cardNumber);
  }
};

const createVariableBlock = (
  variableName: string,
  type: VariableTypes,
  sensorBlock: Block,
  workspace: Workspace
) => {
  const varBlock = createSetVariableBlockWithValue(
    workspace,
    variableName,
    type,
    getDefaultValue(type)
  );
  varBlock.getInput('VALUE').connection.targetBlock().dispose(true);

  varBlock.getInput('VALUE').connection.connect(sensorBlock.outputConnection);

  return varBlock;
};

const setSetupBlock = (
  loopNumber: number,
  scannedCard: boolean,
  cardNumber: string,
  tag: string,
  setupBlock: BlockSvg
) => {
  setupBlock.setFieldValue(loopNumber.toString(), 'LOOP');
  setupBlock.setFieldValue(scannedCard ? 'TRUE' : 'FALSE', 'scanned_card');
  setupBlock.setFieldValue(tag, 'tag');
  setupBlock.setFieldValue(cardNumber, 'card_number');

  saveSensorSetupBlockData({
    blocks: getAllBlocks().map(transformBlock),
    variables: getAllVariables().map(transformVariable),
    type: Blockly.Events.BLOCK_MOVE,
    blockId: setupBlock.id,
  }).forEach(updater);
};
