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

describe("factories if block tests", () => {
  let workspace: Workspace;
  let arduinoBlock;

  afterEach(() => {
    workspace.dispose();
  });

  beforeEach(() => {
    [workspace, arduinoBlock] = createArduinoAndWorkSpace();
    arduinoBlock.setFieldValue("1", "LOOP_TIMES");
  });

  it("if blocks should execute if true is connnected true is connected to it other should not do anything", () => {
    const booleanBlock = createValueBlock(
      workspace,
      VariableTypes.BOOLEAN,
      true
    );
    const debugBlock1 = workspace.newBlock("debug_block");
    const debugBlock2 = workspace.newBlock("debug_block");
    const ifBlock = workspace.newBlock("control_if") as BlockSvg;
    ifBlock.getInput("IF0").connection.connect(booleanBlock.outputConnection);
    ifBlock.getInput("DO0").connection.connect(debugBlock1.previousConnection);
    debugBlock1.nextConnection.connect(debugBlock2.previousConnection);
    connectToArduinoBlock(ifBlock);

    const event = createTestEvent(ifBlock.id);

    const [state1, state2, state3] = eventToFrameFactory(event).frames;
    expect(state1.explanation).toBe(
      'Executing blocks inside "DO" because what is connected is true.'
    );
    expect(state2).toBeDefined();
    expect(state3).toBeDefined();

    ["FALSE", "delete"].forEach((action) => {
      if (action === "delete") {
        booleanBlock.dispose(true);
      } else {
        booleanBlock.setFieldValue(action, "BOOL");
      }

      const event = createTestEvent(ifBlock.id);

      const states = eventToFrameFactory(event).frames;
      expect(states.length).toBe(1);
      const [state1] = states;
      expect(state1.explanation).toBe(
        'Not executing blocks inside "DO" because what is connected is false.'
      );
    });
  });

  it("should be execute else block if what is in there is not true", () => {
    const booleanBlock = createValueBlock(
      workspace,
      VariableTypes.BOOLEAN,
      true
    );
    const debugBlock1 = workspace.newBlock("debug_block");
    const debugBlock2 = workspace.newBlock("debug_block");
    const ifBlock = workspace.newBlock("controls_ifelse") as BlockSvg;
    ifBlock.getInput("IF0").connection.connect(booleanBlock.outputConnection);
    ifBlock.getInput("ELSE").connection.connect(debugBlock1.previousConnection);
    debugBlock1.nextConnection.connect(debugBlock2.previousConnection);
    connectToArduinoBlock(ifBlock);
    const event = createTestEvent(ifBlock.id);

    const states = eventToFrameFactory(event).frames;
    expect(states.length).toBe(1);
    expect(states[0].explanation).toBe(
      'Executing blocks inside "DO" because what is connected is true.'
    );

    ["FALSE", "delete"].forEach((action) => {
      if (action === "delete") {
        booleanBlock.dispose(true);
      } else {
        booleanBlock.setFieldValue(action, "BOOL");
      }

      const event = createTestEvent(debugBlock1.id);

      const states = eventToFrameFactory(event).frames;
      expect(states.length).toBe(3);
      const [state1] = states;
      expect(state1.explanation).toBe(
        'Executing blocks inside "ELSE" because what is connected is false.'
      );
    });
  });
});
