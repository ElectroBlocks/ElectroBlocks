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
import _ from "lodash";

describe("math_arithmetic state factories", () => {
  let workspace: Workspace;
  let arduinoBlock: BlockSvg;

  afterEach(() => {
    workspace.dispose();
  });

  beforeEach(() => {
    [workspace, arduinoBlock] = createArduinoAndWorkSpace();
  });

  it("if the variable we are trying to get does not exist it should use default value", () => {
    const numberVariableBlock = createSetVariableBlockWithValue(
      workspace,
      "num",
      VariableTypes.NUMBER,
      33
    );

    const getVariableNumberBlock = workspace.newBlock("variables_get_number");
    getVariableNumberBlock.setFieldValue(
      numberVariableBlock.getFieldValue("VAR"),
      "VAR"
    );

    const variable = workspace.createVariable("var_test", "Number");
    const testNumberVariableBlock = workspace.newBlock(
      "variables_set_number"
    ) as BlockSvg;
    testNumberVariableBlock.setFieldValue(variable.getId(), "VAR");
    testNumberVariableBlock
      .getInput("VALUE")
      .connection.connect(getVariableNumberBlock.outputConnection);
    connectToArduinoBlock(numberVariableBlock);
    connectToArduinoBlock(testNumberVariableBlock);

    const event = createTestEvent(testNumberVariableBlock.id);
    const [state1, state2] = eventToFrameFactory(event).frames;

    expect(state1.explanation).toBe('Variable "var_test" stores 0.');
    expect(state2.explanation).toBe('Variable "num" stores 33.');
    expect(_.keys(state1.variables).length).toBe(1);
    expect(_.keys(state2.variables).length).toBe(2);
    expect(state1.variables["var_test"].value).toBe(0);
    expect(state2.variables["num"].value).toBe(33);
  });
});
