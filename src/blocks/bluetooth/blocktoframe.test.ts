import { describe, it, beforeEach, afterEach, expect } from "vitest";

import "../../core/blockly/blocks";
import Blockly, { Workspace, BlockSvg } from "blockly";
import {
  getAllBlocks,
  connectToArduinoBlock,
} from "../../core/blockly/helpers/block.helper";
import _ from "lodash";
import type { BlockEvent } from "../../core/blockly/dto/event.type";
import { transformBlock } from "../../core/blockly/transformers/block.transformer";
import { getAllVariables } from "../../core/blockly/helpers/variable.helper";
import { transformVariable } from "../../core/blockly/transformers/variables.transformer";
import { eventToFrameFactory } from "../../core/frames/event-to-frame.factory";
import { ARDUINO_PINS } from "../../core/microcontroller/selectBoard";
import { saveSensorSetupBlockData } from "../../core/blockly/actions/saveSensorSetupBlockData";
import { updater } from "../../core/blockly/updater";
import {
  ArduinoFrame,
  ArduinoComponentType,
} from "../../core/frames/arduino.frame";
import {
  createArduinoAndWorkSpace,
  createValueBlock,
  createTestEvent,
} from "../../tests/tests.helper";
import { VariableTypes } from "../../core/blockly/dto/variable.type";
import { MicroControllerType } from "../../core/microcontroller/microcontroller";
import type { BluetoothState } from "./state";

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
    bluethoothsetupblock.setFieldValue(ARDUINO_PINS.PIN_7, "PIN_RX");
    bluethoothsetupblock.setFieldValue(ARDUINO_PINS.PIN_6, "PIN_TX");

    bluethoothsetupblock.setFieldValue("TRUE", "receiving_message");
    bluethoothsetupblock.setFieldValue("hello world", "message");

    const event = createTestEvent(bluethoothsetupblock.id);
    saveSensorSetupBlockData(event).forEach(updater);
  });

  it("should be able generate state for bluetooth setup block", () => {
    const event = createTestEvent(bluethoothsetupblock.id);

    const btComponent: BluetoothState = {
      pins: [ARDUINO_PINS.PIN_6, ARDUINO_PINS.PIN_7],
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
      frameNumber: 1,
    };

    expect(eventToFrameFactory(event).frames).toEqual([state]);
  });

  it("should be able to send a message via bluetooth block", () => {
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
