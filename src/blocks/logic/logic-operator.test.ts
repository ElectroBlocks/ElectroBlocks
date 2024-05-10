import { describe, it, beforeEach, afterEach, expect } from "vitest";

import "../../core/blockly/blocks";

import type { Workspace, BlockSvg } from "blockly";
import {
  createArduinoAndWorkSpace,
  createSetVariableBlockWithValue,
  createTestEvent,
  createValueBlock,
} from "../../tests/tests.helper";
import { connectToArduinoBlock } from "../../core/blockly/helpers/block.helper";
import { VariableTypes } from "../../core/blockly/dto/variable.type";
import { eventToFrameFactory } from "../../core/frames/event-to-frame.factory";

describe("logic operators blocks", () => {
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
        A: true,
        B: true,
        OP: "OR",
        expectValue: true,
      },
      {
        A: true,
        B: false,
        OP: "OR",
        expectValue: true,
      },
      {
        A: false,
        B: false,
        OP: "OR",
        expectValue: false,
      },
      {
        A: true,
        B: true,
        OP: "AND",
        expectValue: true,
      },
      {
        A: true,
        B: false,
        OP: "AND",
        expectValue: false,
      },
    ].forEach(({ A, B, OP, expectValue }) => {
      const testBlock = createLogicCompareBlock(workspace, A, B, OP);
      boolTest.getInput("VALUE").connection.connect(testBlock.outputConnection);
      const event = createTestEvent(testBlock.id);
      const events = eventToFrameFactory(event).frames;
      const [state1] = events;
      expect(state1.variables["bool_test"].value).toBe(expectValue);
    });

    // If any value are blank it should return false o
    const logicOperatorBlock = workspace.newBlock(
      "logic_operation"
    ) as BlockSvg;
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
    value1: boolean,
    value2: boolean,
    operator: string
  ) => {
    const value1Block = createValueBlock(
      workspace,
      VariableTypes.BOOLEAN,
      value1
    );
    const value2Block = createValueBlock(
      workspace,
      VariableTypes.BOOLEAN,
      value2
    );
    const logicOperatorBlock = workspace.newBlock(
      "logic_operation"
    ) as BlockSvg;
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
