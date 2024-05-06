import { describe, it, beforeEach, afterEach, expect } from "vitest";

import "../../core/blockly/blocks";
import type { Workspace, BlockSvg } from "blockly";
import {
  createArduinoAndWorkSpace,
  createValueBlock,
  createTestEvent,
} from "../../tests/tests.helper";
import { VariableTypes } from "../../core/blockly/dto/variable.type";
import { connectToArduinoBlock } from "../../core/blockly/helpers/block.helper";

import { eventToFrameFactory } from "../../core/frames/event-to-frame.factory";

describe("generate states controls_for block", () => {
  let workspace: Workspace;
  let arduinoBlock;

  afterEach(() => {
    workspace.dispose();
  });

  beforeEach(() => {
    [workspace, arduinoBlock] = createArduinoAndWorkSpace();
    arduinoBlock.setFieldValue("1", "LOOP_TIMES");
  });

  it("should loop -3 to -10 subtracting by 2", () => {
    // -3 -5, -7, -9
    testloop(workspace, -3, -10, 2, [-3, -5, -7, -9]);
  });

  it("should loop -3 to 0 substracting by 1", () => {
    // -3, -2, -1, 0
    testloop(workspace, -3, 0, 1, [-3, -2, -1, 0, 1]);
  });

  it("should loop 1 to 10 by adding by 3", () => {
    // 1, 4, 7, 10
    testloop(workspace, 1, 10, 3, [1, 4, 7, 10]);
  });

  it("should loop 1 to 10 by adding by 2", () => {
    testloop(workspace, 1, 10, 2, [1, 3, 5, 7, 9]);
  });

  it("should be able to handle having nothing inside the loop 1 to 10", () => {
    testloop(workspace, 1, 10, 1, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });

  it("should be able to handler nothing in the from, by, and to inputs", () => {
    testloop(workspace, null, null, null, [1]);
  });

  it("shoudl be able to handle nothing inside the for loop", () => {
    testloop(workspace, 1, 10, 1, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], true);
  });
});

const testloop = (
  workspace: Workspace,
  from: number = null,
  to: number = null,
  by: number = null,
  expectedIValuesInOrder: number[] = [],
  nothingInLoop = false
) => {
  const info = generateFrameForLoop(workspace, from, to, by, nothingInLoop);
  const states = info.frames;
  const debugBlock = info.loopBlock.getInput("DO").connection.targetBlock();
  const expectedNumberOfFrames =
    debugBlock && !nothingInLoop
      ? expectedIValuesInOrder.length * 2
      : expectedIValuesInOrder.length;
  expect(states.length).toBe(expectedNumberOfFrames);
  let counter = 0;
  states.forEach((state, index) => {
    if (index % 2 == 1 && debugBlock && !nothingInLoop) {
      expect(state.blockId).toBe(debugBlock.id);
      return;
    }
    if (index % 2 == 1 && !nothingInLoop) {
      return;
    }

    const iValue = expectedIValuesInOrder[counter];
    expect(state.explanation).toBe(
      `Running loop ${counter + 1} out ${
        expectedIValuesInOrder.length
      } times; i = ${iValue}`
    );
    expect(state.variables["i"].value).toBe(iValue);
    counter += 1;
  });
};

const generateFrameForLoop = (
  workspace: Workspace,
  from: number = null,
  to: number = null,
  by: number = null,
  nothingInLoop = false
) => {
  const forLoopNumber = workspace.newBlock("controls_for") as BlockSvg;

  if (from) {
    const fromNumberBlock = createValueBlock(
      workspace,
      VariableTypes.NUMBER,
      from
    );
    forLoopNumber
      .getInput("FROM")
      .connection.connect(fromNumberBlock.outputConnection);
  }

  if (to) {
    const toNumberBlock = createValueBlock(workspace, VariableTypes.NUMBER, to);

    forLoopNumber
      .getInput("TO")
      .connection.connect(toNumberBlock.outputConnection);
  }

  if (by) {
    forLoopNumber.setFieldValue(by.toString(), "BY");
  }

  if (!nothingInLoop) {
    const debugBlock = workspace.newBlock("debug_block");
    forLoopNumber
      .getInput("DO")
      .connection.connect(debugBlock.previousConnection);
  }

  connectToArduinoBlock(forLoopNumber);

  const event = createTestEvent(forLoopNumber.id);

  return {
    frames: eventToFrameFactory(event).frames,
    loopBlock: forLoopNumber,
  };
};
