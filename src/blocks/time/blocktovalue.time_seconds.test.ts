import "../../core/blockly/blocks";
import type { Workspace, BlockSvg } from "blockly";
import { connectToArduinoBlock } from "../../core/blockly/helpers/block.helper";
import _ from "lodash";
import { describe, it, beforeEach, afterEach, expect } from "vitest";

import { eventToFrameFactory } from "../../core/frames/event-to-frame.factory";
import {
  createArduinoAndWorkSpace,
  createSetVariableBlockWithValue,
  createTestEvent,
} from "../../tests/tests.helper";
import { VariableTypes } from "../../core/blockly/dto/variable.type";
describe("get time block factories", () => {
  let workspace: Workspace;
  let timesetup;
  let arduinoBlock: BlockSvg;

  afterEach(() => {
    workspace.dispose();
  });

  beforeEach(() => {
    [workspace, arduinoBlock] = createArduinoAndWorkSpace();
    timesetup = workspace.newBlock("time_setup");

    timesetup.setFieldValue(".3", "time_in_seconds");
  });

  it("should be able generate state for time setup block", () => {
    arduinoBlock.setFieldValue("3", "LOOP_TIMES");

    const numberVariableBlock = createSetVariableBlockWithValue(
      workspace,
      "seconds",
      VariableTypes.NUMBER,
      1
    );
    numberVariableBlock
      .getInput("VALUE")
      .connection.targetBlock()
      .dispose(true);

    const arduionBlockInSeconds = workspace.newBlock("time_seconds");
    numberVariableBlock
      .getInput("VALUE")
      .connection.connect(arduionBlockInSeconds.outputConnection);

    connectToArduinoBlock(numberVariableBlock);

    const event = createTestEvent(timesetup.id);

    const [state1, state2, state3, state4] = eventToFrameFactory(event).frames;
    expect(state2.variables["seconds"].value).toBe(0.3);
    expect(state3.variables["seconds"].value).toBe(0.6);
    expect(state4.variables["seconds"].value).toBe(0.9);
  });
});
