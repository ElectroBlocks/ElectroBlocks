import { describe, it, beforeEach, afterEach, expect } from "vitest";

import "../../core/blockly/blocks";
import {
  createArduinoAndWorkSpace,
  createSetVariableBlockWithValue,
  createTestEvent,
} from "../../tests/tests.helper";
import type { Workspace, BlockSvg } from "blockly";
import { VariableTypes } from "../../core/blockly/dto/variable.type";
import { connectToArduinoBlock } from "../../core/blockly/helpers/block.helper";
import { eventToFrameFactory } from "../../core/frames/event-to-frame.factory";

describe("text_changeCase state factories", () => {
  let workspace: Workspace;
  let arduinoBlock: BlockSvg;

  afterEach(() => {
    workspace.dispose();
  });

  beforeEach(() => {
    [workspace, arduinoBlock] = createArduinoAndWorkSpace();
  });

  it("should change case text block/variable or nothing is empty", () => {
    const textChangeCase = workspace.newBlock("text_changeCase");
    const textBlock = workspace.newBlock("text");
    textBlock.setFieldValue("hEllo WorLD", "TEXT");
    const setStringVariable = createSetVariableBlockWithValue(
      workspace,
      "random_text",
      VariableTypes.STRING,
      "hEllo WorLD"
    );

    const testStringVariable = createSetVariableBlockWithValue(
      workspace,
      "test_string",
      VariableTypes.STRING,
      "test"
    );

    testStringVariable.getInput("VALUE").connection.targetBlock().dispose(true);

    testStringVariable
      .getInput("VALUE")
      .connection.connect(textChangeCase.outputConnection);

    // Test text block works

    textChangeCase
      .getInput("TEXT")
      .connection.connect(textBlock.outputConnection);

    connectToArduinoBlock(testStringVariable);

    [
      {
        type: "UPPERCASE",
        expectedValue: "HELLO WORLD",
      },
      {
        type: "LOWERCASE",
        expectedValue: "hello world",
      },
    ].forEach(({ type, expectedValue }) => {
      textChangeCase.setFieldValue(type, "CASE");
      const event1 = createTestEvent(textChangeCase.id);
      const [state1Event1] = eventToFrameFactory(event1).frames;

      expect(state1Event1.explanation).toBe(
        `Variable "test_string" stores "${expectedValue}".`
      );
      expect(state1Event1.variables["test_string"].value).toBe(expectedValue);
    });

    textBlock.dispose(true);
    const getStringVariable = workspace.newBlock("variables_get_string");
    getStringVariable.setFieldValue(
      setStringVariable.getFieldValue("VAR"),
      "VAR"
    );
    textChangeCase
      .getInput("TEXT")
      .connection.connect(getStringVariable.outputConnection);

    connectToArduinoBlock(setStringVariable);

    [
      {
        type: "UPPERCASE",
        expectedValue: "HELLO WORLD",
      },
      {
        type: "LOWERCASE",
        expectedValue: "hello world",
      },
    ].forEach(({ type, expectedValue }) => {
      textChangeCase.setFieldValue(type, "CASE");

      const event1 = createTestEvent(textChangeCase.id);

      const [state1Event1, state2Event1] = eventToFrameFactory(event1).frames;

      expect(state2Event1.explanation).toBe(
        `Variable "test_string" stores "${expectedValue}".`
      );
      expect(state2Event1.variables["test_string"].value).toBe(expectedValue);
    });

    getStringVariable.dispose(true);
    setStringVariable.dispose(true);

    [
      {
        type: "UPPERCASE",
      },
      {
        type: "LOWERCASE",
      },
    ].forEach(({ type }) => {
      textChangeCase.setFieldValue(type, "CASE");
      const event1 = createTestEvent(textChangeCase.id);
      const [state1Event1] = eventToFrameFactory(event1).frames;

      expect(state1Event1.explanation).toBe(
        `Variable "test_string" stores "".`
      );
      expect(state1Event1.variables["test_string"].value).toBe("");
    });
  });
});
