import { describe, it, beforeEach, afterEach, expect } from "vitest";

import type { BlockSvg, Workspace } from "blockly";
import "../../core/blockly/blocks";
import { VariableTypes } from "../../core/blockly/dto/variable.type";
import { connectToArduinoBlock } from "../../core/blockly/helpers/block.helper";
import { eventToFrameFactory } from "../../core/frames/event-to-frame.factory";
import {
  createArduinoAndWorkSpace,
  createSetVariableBlockWithValue,
  createTestEvent,
} from "../../tests/tests.helper";

describe("text_length state factories", () => {
  let workspace: Workspace;
  let arduinoBlock: BlockSvg;

  afterEach(() => {
    workspace.dispose();
  });

  beforeEach(() => {
    [workspace, arduinoBlock] = createArduinoAndWorkSpace();
  });

  it("should be able to get the text length of text, variable and no block", () => {
    const textLengthBlock = workspace.newBlock("text_length");
    const textBlock = workspace.newBlock("text");
    textBlock.setFieldValue("blue", "TEXT");
    textLengthBlock
      .getInput("VALUE")
      .connection.connect(textBlock.outputConnection);
    const numVariable = workspace.createVariable("num_test", "Number");
    const numVariableBlock = workspace.newBlock(
      "variables_set_number"
    ) as BlockSvg;
    numVariableBlock.setFieldValue(numVariable.getId(), "VAR");
    numVariableBlock
      .getInput("VALUE")
      .connection.connect(textLengthBlock.outputConnection);

    connectToArduinoBlock(numVariableBlock);

    const event = createTestEvent(numVariableBlock.id);
    const [state1] = eventToFrameFactory(event).frames;

    expect(state1.explanation).toBe('Variable "num_test" stores 4.');
    expect(state1.variables["num_test"].value).toBe(4);

    textBlock.dispose(true);

    const eventTest2 = createTestEvent(numVariableBlock.id);
    const [stateTest1] = eventToFrameFactory(eventTest2).frames;

    expect(stateTest1.explanation).toBe('Variable "num_test" stores 0.');
    expect(stateTest1.variables["num_test"].value).toBe(0);

    const stringVariableBlock = createSetVariableBlockWithValue(
      workspace,
      "test_string",
      VariableTypes.STRING,
      "Hello World!"
    );

    connectToArduinoBlock(stringVariableBlock);
    const getStringVariableBlock = workspace.newBlock("variables_get_string");
    getStringVariableBlock.setFieldValue(
      stringVariableBlock.getFieldValue("VAR"),
      "VAR"
    );
    textLengthBlock
      .getInput("VALUE")
      .connection.connect(getStringVariableBlock.outputConnection);

    const eventTest3 = createTestEvent(numVariableBlock.id);
    const [state1Test3, state2Test3] = eventToFrameFactory(eventTest3).frames;

    expect(state2Test3.explanation).toBe('Variable "num_test" stores 12.');
    expect(state2Test3.variables["num_test"].value).toBe(12);
  });
});
