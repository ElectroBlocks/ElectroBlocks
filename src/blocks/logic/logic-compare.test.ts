import { describe, it, beforeEach, afterEach, expect } from "vitest";

import "../../core/blockly/blocks";

import type { Workspace, BlockSvg } from "blockly";
import {
  createArduinoAndWorkSpace,
  createSetVariableBlockWithValue,
  createValueBlock,
  createTestEvent,
} from "../../tests/tests.helper";
import { VariableTypes } from "../../core/blockly/dto/variable.type";
import { Color } from "../../core/frames/arduino.frame";
import {
  connectToArduinoBlock,
  getAllBlocks,
} from "../../core/blockly/helpers/block.helper";
import { eventToFrameFactory } from "../../core/frames/event-to-frame.factory";
import { transformBlock } from "../../core/blockly/transformers/block.transformer";
import { getAllVariables } from "../../core/blockly/helpers/variable.helper";
import { transformVariable } from "../../core/blockly/transformers/variables.transformer";
import type { BlockEvent } from "../../core/blockly/dto/event.type";

describe("logic compare blocks", () => {
  let workspace: Workspace;

  afterEach(() => {
    workspace.dispose();
  });

  beforeEach(() => {
    [workspace] = createArduinoAndWorkSpace();
  });

  it("should be able to determine if something is true or false, logic_compare", () => {
    const boolTest = createSetVariableBlockWithValue(
      workspace,
      "bool_test",
      VariableTypes.BOOLEAN,
      true
    );
    boolTest.getInput("VALUE").connection.targetBlock().dispose(true);

    connectToArduinoBlock(boolTest);
    [
      {
        A: "blue",
        B: "blue",
        type: VariableTypes.STRING,
        OP: "EQ",
        expectValue: true,
      },
      {
        A: "moo",
        B: "blue",
        type: VariableTypes.STRING,
        OP: "EQ",
        expectValue: false,
      },
      {
        A: "blue",
        B: "red",
        type: VariableTypes.STRING,
        OP: "NEQ",
        expectValue: true,
      },
      {
        A: "blue",
        B: "blue",
        type: VariableTypes.STRING,
        OP: "NEQ",
        expectValue: false,
      },
      { A: 3, B: 4, OP: "LT", type: VariableTypes.NUMBER, expectValue: true },
      { A: 3, B: 4, OP: "LTE", type: VariableTypes.NUMBER, expectValue: true },
      { A: 4, B: 4, OP: "LTE", type: VariableTypes.NUMBER, expectValue: true },
      { A: 4, B: 4, OP: "GTE", type: VariableTypes.NUMBER, expectValue: true },
      { A: 4, B: 4, OP: "GT", type: VariableTypes.NUMBER, expectValue: false },
      { A: 6, B: 4, OP: "GT", type: VariableTypes.NUMBER, expectValue: true },
    ].forEach(({ A, B, OP, type, expectValue }) => {
      const testBlock = createLogicCompareBlock(workspace, type, A, B, OP);
      boolTest.getInput("VALUE").connection.connect(testBlock.outputConnection);
      const event = createTestEvent(testBlock.id);
      const events = eventToFrameFactory(event).frames;
      const [state1] = events;
      expect(state1.variables["bool_test"].value).toBe(expectValue);
    });

    // If any value are blank it should return false o
    const logicOperatorBlock = workspace.newBlock("logic_compare") as BlockSvg;
    boolTest
      .getInput("VALUE")
      .connection.connect(logicOperatorBlock.outputConnection);
    const event = createTestEvent(logicOperatorBlock.id);
    const events = eventToFrameFactory(event).frames;
    const [state1] = events;
    expect(state1.variables["bool_test"].value).toBe(false);
  });

  const createLogicCompareBlock = (
    workspace: Workspace,
    typeCompare: VariableTypes,
    value1: string | boolean | number,
    value2: string | boolean | number,
    operator: string
  ) => {
    const value1Block = createValueBlock(workspace, typeCompare, value1);
    const value2Block = createValueBlock(workspace, typeCompare, value2);
    const logicOperatorBlock = workspace.newBlock("logic_compare") as BlockSvg;
    logicOperatorBlock.setFieldValue(operator, "OP");
    logicOperatorBlock
      .getInput("A")
      .connection.connect(value1Block.outputConnection);
    logicOperatorBlock
      .getInput("B")
      .connection.connect(value2Block.outputConnection);

    return logicOperatorBlock;
  };
});
