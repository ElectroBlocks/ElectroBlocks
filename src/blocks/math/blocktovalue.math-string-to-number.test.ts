import { describe, it, beforeEach, afterEach, expect } from "vitest";

import "../../core/blockly/blocks";
import _ from "lodash";
import type { BlockSvg, Workspace } from "blockly";
import {
  createArduinoAndWorkSpace,
  createSetVariableBlockWithValue,
  createTestEvent,
} from "../../tests/tests.helper";
import { VariableTypes } from "../../core/blockly/dto/variable.type";
import { connectToArduinoBlock } from "../../core/blockly/helpers/block.helper";
import { eventToFrameFactory } from "../../core/frames/event-to-frame.factory";

describe("math_round state factories", () => {
  let workspace: Workspace;
  let arduinoBlock: BlockSvg;

  afterEach(() => {
    workspace.dispose();
  });

  beforeEach(() => {
    [workspace, arduinoBlock] = createArduinoAndWorkSpace();
  });

  it("should be able to take a variable string and turn it into a number", () => {
    arduinoBlock.setFieldValue("1", "LOOP_TIMES");
    const stringVariableBlock = createSetVariableBlockWithValue(
      workspace,
      "num_string",
      VariableTypes.STRING,
      3.432
    );
    const getVariableTextBlock = workspace.newBlock("variables_get_string");
    getVariableTextBlock.setFieldValue(
      stringVariableBlock.getFieldValue("VAR"),
      "VAR"
    );

    const stringToNumberBlock = workspace.newBlock("string_to_number");
    stringToNumberBlock
      .getInput("VALUE")
      .connection.connect(getVariableTextBlock.outputConnection);
    const variableNumTest = workspace.createVariable("num_test", "Number");
    const setNumberBlock = workspace.newBlock(
      "variables_set_number"
    ) as BlockSvg;
    setNumberBlock.setFieldValue(variableNumTest.getId(), "VAR");
    setNumberBlock
      .getInput("VALUE")
      .connection.connect(stringToNumberBlock.outputConnection);

    connectToArduinoBlock(setNumberBlock);
    connectToArduinoBlock(stringVariableBlock);

    const event = createTestEvent(setNumberBlock.id);
    const [state1, state2] = eventToFrameFactory(event).frames;
    expect(state2.explanation).toContain(`Variable "num_test" stores 3.432.`);
    expect(state2.variables["num_test"].value).toBe(3.432);
    expect(_.keys(state1.variables).length).toBe(1);
    expect(_.keys(state2.variables).length).toBe(2);
  });

  it("should be able to string_to_number if no block is connected", () => {
    const stringToNumberBlock = workspace.newBlock("string_to_number");
    const variableNumTest = workspace.createVariable("num_test", "Number");
    const setNumberBlock = workspace.newBlock(
      "variables_set_number"
    ) as BlockSvg;
    setNumberBlock.setFieldValue(variableNumTest.getId(), "VAR");
    setNumberBlock
      .getInput("VALUE")
      .connection.connect(stringToNumberBlock.outputConnection);

    connectToArduinoBlock(setNumberBlock);

    const event = createTestEvent(setNumberBlock.id);
    const [state] = eventToFrameFactory(event).frames;
    expect(state.explanation).toContain(`Variable "num_test" stores 1.`);
    expect(state.variables["num_test"].value).toBe(1);
  });
});
