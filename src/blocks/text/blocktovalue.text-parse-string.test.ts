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

describe("parse_string_block state factories", () => {
  let workspace: Workspace;
  let arduinoBlock: BlockSvg;

  afterEach(() => {
    workspace.dispose();
  });

  beforeEach(() => {
    [workspace, arduinoBlock] = createArduinoAndWorkSpace();
  });

  it("should be able to parse a string with an empty string", () => {
    const textBlock = workspace.newBlock("text");
    textBlock.setFieldValue("blue*red*yellow", "TEXT");
    const parseBlock = workspace.newBlock("parse_string_block");
    parseBlock.setFieldValue("*", "DELIMITER");
    parseBlock.getInput("VALUE").connection.connect(textBlock.outputConnection);
    const numberBlock = workspace.newBlock("math_number");
    numberBlock.setFieldValue("-1", "NUM");
    parseBlock
      .getInput("POSITION")
      .connection.connect(numberBlock.outputConnection);

    const setTextBlock = createSetVariableBlockWithValue(
      workspace,
      "text_test",
      VariableTypes.STRING,
      ""
    );
    const textBlockToRemove = setTextBlock
      .getInput("VALUE")
      .connection.targetBlock();
    textBlockToRemove.dispose(true);

    setTextBlock
      .getInput("VALUE")
      .connection.connect(parseBlock.outputConnection);

    connectToArduinoBlock(setTextBlock);

    // Testing index / position is invalid
    const event = createTestEvent(setTextBlock.id);
    const [state1] = eventToFrameFactory(event).frames;

    expect(state1.explanation).toBe('Variable "text_test" stores "".');
    expect(state1.variables["text_test"].value).toBe("");

    // Testing When Delemiter does not exist
    parseBlock.setFieldValue("|", "DELIMITER");
    numberBlock.setFieldValue("1", "NUM");

    const event2 = createTestEvent(numberBlock.id);
    const [stateTest2] = eventToFrameFactory(event2).frames;

    expect(stateTest2.explanation).toBe('Variable "text_test" stores "".');
    expect(stateTest2.variables["text_test"].value).toBe("");

    // Testing it can get all the values
    ["blue", "red", "yellow"].forEach((value, index) => {
      parseBlock.setFieldValue("*", "DELIMITER");
      numberBlock.setFieldValue((index + 1).toString(), "NUM");

      const event = createTestEvent(numberBlock.id);

      const [stateTest2] = eventToFrameFactory(event).frames;

      expect(stateTest2.explanation).toBe(
        `Variable "text_test" stores "${value}".`
      );
      expect(stateTest2.variables["text_test"].value).toBe(value);
    });

    // testing if position is greater than the array length

    parseBlock.setFieldValue("*", "DELIMITER");
    numberBlock.setFieldValue("7", "NUM");

    const event4 = createTestEvent(numberBlock.id);
    const [stateTest4] = eventToFrameFactory(event4).frames;

    expect(stateTest4.explanation).toBe('Variable "text_test" stores "".');
    expect(stateTest4.variables["text_test"].value).toBe("");
  });
});
