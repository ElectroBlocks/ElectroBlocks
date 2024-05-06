import { describe, it, beforeEach, afterEach, expect } from "vitest";

import "../../core/blockly/blocks";
import type { Workspace, BlockSvg } from "blockly";
import {
  createArduinoAndWorkSpace,
  createTestEvent,
} from "../../tests/tests.helper";
import { connectToArduinoBlock } from "../../core/blockly/helpers/block.helper";
import { eventToFrameFactory } from "../../core/frames/event-to-frame.factory";

describe("generate states for functions", () => {
  let workspace: Workspace;
  let arduinoBlock: BlockSvg;

  afterEach(() => {
    workspace.dispose();
  });

  beforeEach(() => {
    [workspace, arduinoBlock] = createArduinoAndWorkSpace();
    arduinoBlock.setFieldValue("1", "LOOP_TIMES");
  });

  it("should be able to create an call a function", () => {
    const functionBlock = workspace.newBlock("procedures_defnoreturn");
    functionBlock.setFieldValue("funcName", "NAME");
    const debugBlock = workspace.newBlock("debug_block");
    functionBlock
      .getInput("STACK")
      .connection.connect(debugBlock.previousConnection);

    const funcCallBlock = workspace.newBlock(
      "procedures_callnoreturn"
    ) as BlockSvg;
    funcCallBlock.setFieldValue("funcName", "NAME");
    connectToArduinoBlock(funcCallBlock);

    const event = createTestEvent(funcCallBlock.id);

    const states = eventToFrameFactory(event).frames;
    expect(states.length).toBe(2);
    const [state1, state2] = states;
    expect(state1.blockId).toBe(funcCallBlock.id);
    expect(state1.explanation).toBe("Calling function funcName.");
    expect(state2.blockId).toBe(debugBlock.id);
  });
});
