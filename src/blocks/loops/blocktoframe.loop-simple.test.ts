import { describe, it, beforeEach, afterEach, expect } from "vitest";

import "../../core/blockly/blocks";
import type { Workspace, BlockSvg } from "blockly";
import {
  createArduinoAndWorkSpace,
  createTestEvent,
  createValueBlock,
} from "../../tests/tests.helper";
import { VariableTypes } from "../../core/blockly/dto/variable.type";
import { connectToArduinoBlock } from "../../core/blockly/helpers/block.helper";
import { eventToFrameFactory } from "../../core/frames/event-to-frame.factory";

describe("generate states controls_repeat_ext", () => {
  let workspace: Workspace;
  let arduinoBlock;

  afterEach(() => {
    workspace.dispose();
  });

  beforeEach(() => {
    [workspace, arduinoBlock] = createArduinoAndWorkSpace();
    arduinoBlock.setFieldValue("1", "LOOP_TIMES");
  });

  it("should generate states for the number of times plugged in the TIMES slot", () => {
    const simpleForLoop = workspace.newBlock("controls_repeat_ext") as BlockSvg;
    const numberBlock = createValueBlock(workspace, VariableTypes.NUMBER, 3);
    const debugBlock = workspace.newBlock("debug_block");
    simpleForLoop
      .getInput("DO")
      .connection.connect(debugBlock.previousConnection);
    simpleForLoop
      .getInput("TIMES")
      .connection.connect(numberBlock.outputConnection);

    connectToArduinoBlock(simpleForLoop);

    const event = createTestEvent(simpleForLoop.id);

    const states = eventToFrameFactory(event).frames;
    expect(states.length).toBe(6);
    const [state1, state2, state3, state4, state5, state6] = states;

    expect(state2.blockId).toBe(debugBlock.id);

    expect(state1.explanation).toBe("Running loop 1 out of 3 times.");

    expect(state1.blockId).toBe(simpleForLoop.id);

    expect(state3.explanation).toBe("Running loop 2 out of 3 times.");
    expect(state3.blockId).toBe(simpleForLoop.id);

    expect(state5.explanation).toBe("Running loop 3 out of 3 times.");
    expect(state5.blockId).toBe(simpleForLoop.id);

    // Testing if no loop times input is present
    numberBlock.dispose(true);

    const event2 = createTestEvent(simpleForLoop.id);

    const states2 = eventToFrameFactory(event2).frames;
    expect(states2.length).toBe(2);
    expect(states2[0].explanation).toBe("Running loop 1 out of 1 times.");

    expect(states2[1].blockId).toBe(debugBlock.id);
  });
});
