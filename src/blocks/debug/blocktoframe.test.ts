import { describe, it, beforeEach, afterEach, expect } from "vitest";

import "../../core/blockly/blocks";
import type { Workspace, BlockSvg } from "blockly";
import {
  createArduinoAndWorkSpace,
  createSetVariableBlockWithValue,
  createTestEvent,
} from "../../tests/tests.helper";
import { connectToArduinoBlock } from "../../core/blockly/helpers/block.helper";
import { VariableTypes } from "../../core/blockly/dto/variable.type";
import { eventToFrameFactory } from "../../core/frames/event-to-frame.factory";

describe("factories debug state", () => {
  let workspace: Workspace;

  afterEach(() => {
    workspace.dispose();
  });

  beforeEach(() => {
    [workspace] = createArduinoAndWorkSpace();
  });

  it("should create debug state with all variables and components", () => {
    const debugBlock = workspace.newBlock("debug_block") as BlockSvg;
    connectToArduinoBlock(debugBlock);
    const numberVarBlock = createSetVariableBlockWithValue(
      workspace,
      "var1",
      VariableTypes.NUMBER,
      33
    );
    connectToArduinoBlock(numberVarBlock);

    const event = createTestEvent(numberVarBlock.id);

    const [state1, state2] = eventToFrameFactory(event).frames;

    expect(state2.blockId).toBe(debugBlock.id);
    expect(state2.explanation).toBe("Debug [will pause in Arduino Code.]");
    expect(state1.variables["var1"].value).toBe(33);
  });
});
