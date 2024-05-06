import type { BlockSvg, Workspace } from "blockly";
import { describe, it, beforeEach, afterEach, expect } from "vitest";

import "../../core/blockly/blocks";
import { VariableTypes } from "../../core/blockly/dto/variable.type";
import { connectToArduinoBlock } from "../../core/blockly/helpers/block.helper";
import { eventToFrameFactory } from "../../core/frames/event-to-frame.factory";
import {
  createArduinoAndWorkSpace,
  createSetVariableBlockWithValue,
  createTestEvent,
} from "../../tests/tests.helper";

describe("text_join state factories", () => {
  let workspace: Workspace;
  let arduinoBlock: BlockSvg;

  afterEach(() => {
    workspace.dispose();
  });

  beforeEach(() => {
    [workspace, arduinoBlock] = createArduinoAndWorkSpace();
  });

  it("should be able to join text blocks and variable string together", () => {
    const textJoinBlock = workspace.newBlock("text_join") as BlockSvg;
    (textJoinBlock as any).itemCount_ = 3;
    (textJoinBlock as any).updateShape_();

    const stringVariableBlock = createSetVariableBlockWithValue(
      workspace,
      "usb_word",
      VariableTypes.STRING,
      "3.434.34"
    );

    const getVariableTextBlock = workspace.newBlock("variables_get_string");
    getVariableTextBlock.setFieldValue(
      stringVariableBlock.getFieldValue("VAR"),
      "VAR"
    );

    const textBlock1 = workspace.newBlock("text");
    textBlock1.setFieldValue("*", "TEXT");

    const textBlock2 = workspace.newBlock("text");
    textBlock2.setFieldValue("*", "TEXT");

    textJoinBlock
      .getInput("ADD0")
      .connection.connect(textBlock1.outputConnection);

    textJoinBlock
      .getInput("ADD1")
      .connection.connect(getVariableTextBlock.outputConnection);

    textJoinBlock
      .getInput("ADD2")
      .connection.connect(textBlock2.outputConnection);

    const variableStringTest = workspace.createVariable(
      "test_string",
      "String"
    );
    const setStringVariableBlock = workspace.newBlock(
      "variables_set_string"
    ) as BlockSvg;
    setStringVariableBlock.setFieldValue(variableStringTest.getId(), "VAR");
    setStringVariableBlock
      .getInput("VALUE")
      .connection.connect(textJoinBlock.outputConnection);
    connectToArduinoBlock(setStringVariableBlock);
    connectToArduinoBlock(stringVariableBlock);

    const event = createTestEvent(setStringVariableBlock.id);
    const [state1, state2] = eventToFrameFactory(event).frames;

    expect(state1.explanation).toBe('Variable "usb_word" stores "3.434.34".');
    expect(state2.explanation).toBe(
      'Variable "test_string" stores "*3.434.34*".'
    );
    expect(state2.variables["test_string"].value).toBe("*3.434.34*");
  });

  it("should return an empty string if nothing is connected to it.", () => {
    const textJoinBlock = workspace.newBlock("text_join") as BlockSvg;
    (textJoinBlock as any).itemCount_ = 3;
    (textJoinBlock as any).updateShape_();
    const variableStringTest = workspace.createVariable(
      "test_string",
      "String"
    );
    const setStringVariableBlock = workspace.newBlock(
      "variables_set_string"
    ) as BlockSvg;
    setStringVariableBlock.setFieldValue(variableStringTest.getId(), "VAR");
    setStringVariableBlock
      .getInput("VALUE")
      .connection.connect(textJoinBlock.outputConnection);
    connectToArduinoBlock(setStringVariableBlock);

    const event = createTestEvent(setStringVariableBlock.id);
    const [state1] = eventToFrameFactory(event).frames;
    expect(state1.explanation).toBe('Variable "test_string" stores "".');
    expect(state1.variables["test_string"].value).toBe("");
  });
});
