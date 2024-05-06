import { describe, it, beforeEach, afterEach, expect } from "vitest";

import "../../core/blockly/blocks";
import type { Workspace, BlockSvg } from "blockly";
import { connectToArduinoBlock } from "../../core/blockly/helpers/block.helper";
import _ from "lodash";
import { eventToFrameFactory } from "../../core/frames/event-to-frame.factory";
import { saveSensorSetupBlockData } from "../../core/blockly/actions/saveSensorSetupBlockData";
import { updater } from "../../core/blockly/updater";
import {
  createArduinoAndWorkSpace,
  createSetVariableBlockWithValue,
  createTestEvent,
} from "../../tests/tests.helper";
import { VariableTypes } from "../../core/blockly/dto/variable.type";

describe("arduino message state factories", () => {
  let workspace: Workspace;
  let messageSetup;
  let arduinoBlock: BlockSvg;

  afterEach(() => {
    workspace.dispose();
  });

  beforeEach(() => {
    [workspace, arduinoBlock] = createArduinoAndWorkSpace();
    arduinoBlock.setFieldValue("3", "LOOP_TIMES");
    messageSetup = workspace.newBlock("message_setup");

    messageSetup.setFieldValue("1", "LOOP");
    messageSetup.setFieldValue("TRUE", "receiving_message");
    messageSetup.setFieldValue("one", "message");

    const event = createTestEvent(messageSetup.id);
    saveSensorSetupBlockData(event).forEach(updater);

    messageSetup.setFieldValue("2", "LOOP");
    messageSetup.setFieldValue("TRUE", "receiving_message");
    messageSetup.setFieldValue("two", "message");

    const event2 = createTestEvent(messageSetup.id);
    saveSensorSetupBlockData(event2).forEach(updater);

    messageSetup.setFieldValue("3", "LOOP");
    messageSetup.setFieldValue("FALSE", "receiving_message");

    const event3 = createTestEvent(messageSetup.id);
    saveSensorSetupBlockData(event3).forEach(updater);
  });

  it("should be to get the text message being sent", () => {
    const textVariableBlock = createSetVariableBlockWithValue(
      workspace,
      "text",
      VariableTypes.STRING,
      "blue"
    );
    textVariableBlock.getInput("VALUE").connection.targetBlock().dispose(true);

    const getMessageBlock = workspace.newBlock("arduino_get_message");
    textVariableBlock
      .getInput("VALUE")
      .connection.connect(getMessageBlock.outputConnection);

    connectToArduinoBlock(textVariableBlock);
    const event = createTestEvent(messageSetup.id);

    const [state1, state2, state3, state4] = eventToFrameFactory(event).frames;
    expect(state2.variables["text"].value).toBe("one");
    expect(state3.variables["text"].value).toBe("two");
    expect(state4.variables["text"].value).toBe("");
  });

  it("should be able to see if the arduino is recieving a message", () => {
    const boolVariableBlock = createSetVariableBlockWithValue(
      workspace,
      "has_message",
      VariableTypes.BOOLEAN,
      "blue"
    );
    boolVariableBlock.getInput("VALUE").connection.targetBlock().dispose(true);

    const getMessageBlock = workspace.newBlock("arduino_receive_message");
    boolVariableBlock
      .getInput("VALUE")
      .connection.connect(getMessageBlock.outputConnection);

    connectToArduinoBlock(boolVariableBlock);
    const event = createTestEvent(boolVariableBlock.id);

    const [_, state2, state3, state4] = eventToFrameFactory(event).frames;
    expect(state2.variables["has_message"].value).toBeTruthy();
    expect(state3.variables["has_message"].value).toBeTruthy();
    expect(state4.variables["has_message"].value).toBeFalsy();
  });
});
