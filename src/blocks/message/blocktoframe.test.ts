import { describe, it, beforeEach, afterEach, expect } from "vitest";

import "../../core/blockly/blocks";
import type { Workspace, BlockSvg } from "blockly";
import { connectToArduinoBlock } from "../../core/blockly/helpers/block.helper";
import _ from "lodash";
import { eventToFrameFactory } from "../../core/frames/event-to-frame.factory";
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
import type { ArduinoReceiveMessageState } from "./state";

describe("arduino message state factories", () => {
  let workspace: Workspace;
  let messageSetup;
  let arduinoBlock: BlockSvg;

  afterEach(() => {
    workspace.dispose();
  });

  beforeEach(() => {
    [workspace, arduinoBlock] = createArduinoAndWorkSpace();
    arduinoBlock.setFieldValue("1", "LOOP_TIMES");
    messageSetup = workspace.newBlock("message_setup");

    messageSetup.setFieldValue("TRUE", "receiving_message");
    messageSetup.setFieldValue("hello world", "message");

    const event = createTestEvent(messageSetup.id);
    saveSensorSetupBlockData(event).forEach(updater);
  });

  it("should be able send a message", () => {
    const sendMessageBlock = workspace.newBlock(
      "arduino_send_message"
    ) as BlockSvg;
    const textBlock = createValueBlock(
      workspace,
      VariableTypes.STRING,
      "Hello World!"
    );
    sendMessageBlock
      .getInput("MESSAGE")
      .connection.connect(textBlock.outputConnection);

    connectToArduinoBlock(sendMessageBlock);

    const event = createTestEvent(messageSetup.id);

    const [state1, state2] = eventToFrameFactory(event).frames;

    expect(state2.blockId).toBe(sendMessageBlock.id);
    expect(state2.explanation).toBe('Arduino sending message: "Hello World!".');
    expect(state2.sendMessage).toBe("Hello World!");
    expect(state2.txLedOn).toBeTruthy();
    expect(state2.builtInLedOn).toBeFalsy();
  });

  it("should be able generate state for message setup block", () => {
    const event = createTestEvent(messageSetup.id);

    const message: ArduinoReceiveMessageState = {
      pins: [],
      hasMessage: true,
      message: "hello world",
      type: ArduinoComponentType.MESSAGE,
    };

    const state: ArduinoFrame = {
      blockId: messageSetup.id,
      blockName: "message_setup",
      timeLine: { function: "pre-setup", iteration: 0 },
      explanation: "Setting up Arduino messages.",
      components: [message],
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
});
