import { describe, it, beforeEach, afterEach, expect } from "vitest";

import "../../core/blockly/blocks";
import _ from "lodash";
import type { BlockSvg, Workspace } from "blockly";
import {
  createArduinoAndWorkSpace,
  createTestEvent,
} from "../../tests/tests.helper";
import { connectToArduinoBlock } from "../../core/blockly/helpers/block.helper";
import { eventToFrameFactory } from "../../core/frames/event-to-frame.factory";

describe("math_random_int state factories", () => {
  let workspace: Workspace;
  let arduinoBlock: BlockSvg;

  afterEach(() => {
    workspace.dispose();
  });

  beforeEach(() => {
    [workspace, arduinoBlock] = createArduinoAndWorkSpace();
  });

  it("math_random_int block should be able to generate random numbers", () => {
    arduinoBlock.setFieldValue("1", "LOOP_TIMES");
    const variableNumTest = workspace.createVariable("num_test", "Number");
    const setNumberBlock = workspace.newBlock(
      "variables_set_number"
    ) as BlockSvg;
    setNumberBlock.setFieldValue(variableNumTest.getId(), "VAR");

    const mathRandomBlock = workspace.newBlock("math_random_int");
    const fromBlock = workspace.newBlock("math_number");
    fromBlock.setFieldValue("-30", "NUM");
    const toBlock = workspace.newBlock("math_number");
    toBlock.setFieldValue("2", "NUM");
    mathRandomBlock
      .getInput("FROM")
      .connection.connect(fromBlock.outputConnection);
    mathRandomBlock.getInput("TO").connection.connect(toBlock.outputConnection);
    setNumberBlock
      .getInput("VALUE")
      .connection.connect(mathRandomBlock.outputConnection);
    connectToArduinoBlock(setNumberBlock);

    const event = createTestEvent(setNumberBlock.id);
    const [state] = eventToFrameFactory(event).frames;
    expect(state.explanation).toContain(`Variable "num_test" stores `);
    const value = state.variables["num_test"].value;
    expect(-30 <= value).toBeTruthy();
    expect(2 >= value).toBeTruthy();
    expect(_.keys(state.variables).length).toBe(1);
  });

  it("math_random_int block should be able to generate random numbers", () => {
    arduinoBlock.setFieldValue("1", "LOOP_TIMES");
    const variableNumTest = workspace.createVariable("num_test", "Number");
    const setNumberBlock = workspace.newBlock(
      "variables_set_number"
    ) as BlockSvg;
    setNumberBlock.setFieldValue(variableNumTest.getId(), "VAR");

    const mathRandomBlock = workspace.newBlock("math_random_int");
    setNumberBlock
      .getInput("VALUE")
      .connection.connect(mathRandomBlock.outputConnection);
    connectToArduinoBlock(setNumberBlock);

    const event = createTestEvent(setNumberBlock.id);
    const [state] = eventToFrameFactory(event).frames;
    expect(state.explanation).toContain(`Variable "num_test" stores `);
    expect(state.variables["num_test"].value).toBe(1);
    expect(_.keys(state.variables).length).toBe(1);
  });
});
