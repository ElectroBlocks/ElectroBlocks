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

describe("text_isEmpty state factories", () => {
  let workspace: Workspace;
  let arduinoBlock: BlockSvg;

  afterEach(() => {
    workspace.dispose();
  });

  beforeEach(() => {
    [workspace, arduinoBlock] = createArduinoAndWorkSpace();
  });

  it("should is empty should detect whether a text block/variable or nothing is empty", () => {
    const textIsEmpty = workspace.newBlock("text_isEmpty");
    const textBlock = workspace.newBlock("text");
    textBlock.setFieldValue("", "TEXT");
    const setStringVariable = createSetVariableBlockWithValue(
      workspace,
      "random_text",
      VariableTypes.STRING,
      "blue"
    );
    const testBoolVariable = createSetVariableBlockWithValue(
      workspace,
      "test_bool",
      VariableTypes.BOOLEAN,
      false
    );
    testBoolVariable.getInput("VALUE").connection.targetBlock().dispose(true);

    testBoolVariable
      .getInput("VALUE")
      .connection.connect(textIsEmpty.outputConnection);

    // Test text block works

    textIsEmpty
      .getInput("VALUE")
      .connection.connect(textBlock.outputConnection);

    connectToArduinoBlock(testBoolVariable);

    const event1 = createTestEvent(textIsEmpty.id);
    const [state1Event1] = eventToFrameFactory(event1).frames;

    expect(state1Event1.explanation).toBe('Variable "test_bool" stores true.');
    expect(state1Event1.variables["test_bool"].value).toBeTruthy();

    textBlock.dispose(true);
    const getStringVariable = workspace.newBlock("variables_get_string");
    getStringVariable.setFieldValue(
      setStringVariable.getFieldValue("VAR"),
      "VAR"
    );
    textIsEmpty
      .getInput("VALUE")
      .connection.connect(getStringVariable.outputConnection);

    connectToArduinoBlock(setStringVariable);

    const event2 = createTestEvent(textIsEmpty.id);
    const [state1Event2, state2Event2] = eventToFrameFactory(event2).frames;

    expect(state2Event2.explanation).toBe('Variable "test_bool" stores false.');
    expect(state2Event2.variables["test_bool"].value).toBeFalsy();

    getStringVariable.dispose(true);
    setStringVariable.dispose(true);

    const event3 = createTestEvent(setStringVariable.id);
    const [state2Event3] = eventToFrameFactory(event3).frames;

    expect(state2Event3.explanation).toBe('Variable "test_bool" stores true.');
    expect(state2Event3.variables["test_bool"].value).toBeTruthy();
  });
});
