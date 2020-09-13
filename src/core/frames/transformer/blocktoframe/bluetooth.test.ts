import "jest";
import "../../../blockly/blocks";
import Blockly, { Workspace, BlockSvg, WorkspaceSvg, Blocks } from "blockly";
import {
  getAllBlocks,
  connectToArduinoBlock,
} from "../../../blockly/helpers/block.helper";
import _ from "lodash";
import { BlockEvent } from "../../../blockly/dto/event.type";
import { transformBlock } from "../../../blockly/transformers/block.transformer";
import { getAllVariables } from "../../../blockly/helpers/variable.helper";
import { transformVariable } from "../../../blockly/transformers/variables.transformer";
import { eventToFrameFactory } from "../../event-to-frame.factory";
import { ARDUINO_PINS } from "../../../microcontroller/selectBoard";
import { saveSensorSetupBlockData } from "../../../blockly/actions/factories/saveSensorSetupBlockData";
import { updater } from "../../../blockly/updater";
import { ArduinoFrame, ArduinoComponentType } from "../../arduino.frame";
import { BluetoothState } from "../../arduino-components.state";
import {
  createArduinoAndWorkSpace,
  createValueBlock,
  createTestEvent,
} from "../../../../tests/tests.helper";
import { VariableTypes } from "../../../blockly/dto/variable.type";
import { MicroControllerType } from "../../../microcontroller/microcontroller";

describe("bluetooth state factories", () => {
  let workspace: Workspace;
  let bluethoothsetupblock;
  let arduinoBlock: BlockSvg;

  afterEach(() => {
    workspace.dispose();
  });

  beforeEach(() => {
    [workspace, arduinoBlock] = createArduinoAndWorkSpace();
    bluethoothsetupblock = workspace.newBlock("bluetooth_setup");
    bluethoothsetupblock.setFieldValue(ARDUINO_PINS.PIN_7, "RX");
    bluethoothsetupblock.setFieldValue(ARDUINO_PINS.PIN_6, "TX");

    bluethoothsetupblock.setFieldValue("TRUE", "receiving_message");
    bluethoothsetupblock.setFieldValue("hello world", "message");

    const event = createTestEvent(bluethoothsetupblock.id);
    saveSensorSetupBlockData(event).forEach(updater);
  });

  test("should be able generate state for bluetooth setup block", () => {
    const event = createTestEvent(bluethoothsetupblock.id);

    const btComponent: BluetoothState = {
      pins: [ARDUINO_PINS.PIN_7, ARDUINO_PINS.PIN_6],
      rxPin: ARDUINO_PINS.PIN_7,
      txPin: ARDUINO_PINS.PIN_6,
      hasMessage: true,
      message: "hello world",
      sendMessage: "",
      type: ArduinoComponentType.BLUE_TOOTH,
    };

    const state: ArduinoFrame = {
      blockId: bluethoothsetupblock.id,
      blockName: "bluetooth_setup",
      timeLine: { function: "pre-setup", iteration: 0 },
      explanation: "Setting up Bluetooth.",
      components: [btComponent],
      variables: {},
      txLedOn: false,
      builtInLedOn: false,
      sendMessage: "", // message arduino is sending
      delay: 0, // Number of milliseconds to delay
      powerLedOn: true,
    };

    expect(eventToFrameFactory(event).frames).toEqual([state]);
  });

  test("should be able to send a message via bluetooth block", () => {
    arduinoBlock.setFieldValue("2", "LOOP_TIMES");

    const btSendMessageBlock = workspace.newBlock(
      "bluetooth_send_message"
    ) as BlockSvg;
    const textMessage = createValueBlock(
      workspace,
      VariableTypes.STRING,
      "HELLO WORLD"
    );
    btSendMessageBlock
      .getInput("MESSAGE")
      .connection.connect(textMessage.outputConnection);

    connectToArduinoBlock(btSendMessageBlock);

    const event1: BlockEvent = {
      blocks: getAllBlocks().map(transformBlock),
      variables: getAllVariables().map(transformVariable),
      type: Blockly.Events.BLOCK_MOVE,
      blockId: bluethoothsetupblock.id,
      microController: MicroControllerType.ARDUINO_UNO,
    };

    const [state1, state2, state3] = eventToFrameFactory(event1).frames;

    expect(state2.explanation).toEqual(
      'Sending "HELLO WORLD" from bluetooth to computer.'
    );
    expect(state2.blockId).toBe(btSendMessageBlock.id);
    expect(state2.components.length).toBe(1);
    const btComponentS2 = state2.components.find(
      (c) => c.type === ArduinoComponentType.BLUE_TOOTH
    ) as BluetoothState;
    expect(btComponentS2.sendMessage).toBe("HELLO WORLD");

    expect(state3.blockId).toBe(btSendMessageBlock.id);
    expect(state3.components.length).toBe(1);
    const btComponentS3 = state3.components.find(
      (c) => c.type === ArduinoComponentType.BLUE_TOOTH
    ) as BluetoothState;
    expect(btComponentS3.sendMessage).toBe("HELLO WORLD");

    btSendMessageBlock
      .getInput("MESSAGE")
      .connection.targetBlock()
      .dispose(true);

    const event2: BlockEvent = {
      blocks: getAllBlocks().map(transformBlock),
      variables: getAllVariables().map(transformVariable),
      type: Blockly.Events.BLOCK_MOVE,
      blockId: bluethoothsetupblock.id,
      microController: MicroControllerType.ARDUINO_UNO,
    };

    const [state1e2, state2e2] = eventToFrameFactory(event2).frames;

    expect(state2e2.explanation).toEqual(
      'Sending "" from bluetooth to computer.'
    );
    expect(state2e2.blockId).toBe(btSendMessageBlock.id);
  });
});
