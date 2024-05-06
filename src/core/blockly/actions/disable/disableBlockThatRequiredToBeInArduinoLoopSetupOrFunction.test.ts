import { describe, it, beforeEach, afterEach, expect } from "vitest";

import "../../blocks";
import type { Workspace, BlockSvg } from "blockly";
import { connectToArduinoBlock } from "../../helpers/block.helper";
import _ from "lodash";

import { disableBlockThatRequiredToBeInArduinoLoopSetupOrFunction } from "./disableBlockThatRequiredToBeInArduinoLoopSetupOrFunction";
import { ActionType } from "../actions";
import {
  createArduinoAndWorkSpace,
  createTestEvent,
} from "../../../../tests/tests.helper";

describe("disableBlockThatRequiredToBeInArduinoLoopSetupOrFunction", () => {
  let workspace: Workspace;
  let arduinoBlock;

  beforeEach(() => {
    [workspace, arduinoBlock] = createArduinoAndWorkSpace();
  });

  afterEach(() => {
    workspace.dispose();
  });

  it("blocks that require to be in an arduino loop block setup or function should be disabled", () => {
    const debugBlock1 = workspace.newBlock("debug_block") as BlockSvg;
    const debugBlock2 = workspace.newBlock("debug_block") as BlockSvg;
    const servoBlock = workspace.newBlock("rotate_servo") as BlockSvg;

    // Connects it to the top part of the input statement
    connectToArduinoBlock(debugBlock2);
    connectToArduinoBlock(servoBlock);
    connectToArduinoBlock(debugBlock1);

    const debugBlock3 = workspace.newBlock("debug_block") as BlockSvg;
    const debugBlock4 = workspace.newBlock("debug_block") as BlockSvg;
    const servoBlock1 = workspace.newBlock("rotate_servo") as BlockSvg;
    const event = createTestEvent(arduinoBlock.id);

    const actions =
      disableBlockThatRequiredToBeInArduinoLoopSetupOrFunction(event);

    expect(actions.length).toBe(3);
    expect(actions.map((a) => a.blockId)).toEqual([
      debugBlock3.id,
      debugBlock4.id,
      servoBlock1.id,
    ]);
    expect(actions[0].type).toBe(ActionType.DISABLE_BLOCK);
    expect(actions.map((b) => b.warningText)).toEqual([null, null, null]);
  });

  it("should disable blocks that are connected but not to a function, loop or setup", () => {
    const debugBlock1 = workspace.newBlock("debug_block") as BlockSvg;
    const debugBlock2 = workspace.newBlock("debug_block") as BlockSvg;

    debugBlock1.nextConnection.connect(debugBlock2.previousConnection);

    const event = createTestEvent(arduinoBlock.id);

    const actions =
      disableBlockThatRequiredToBeInArduinoLoopSetupOrFunction(event);

    expect(actions.length).toBe(2);
  });
});
