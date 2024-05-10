import { describe, it, beforeEach, afterEach, expect } from "vitest";

import "../../core/blockly/blocks";

import type { Workspace, BlockSvg } from "blockly";
import {
  createArduinoAndWorkSpace,
  createSetVariableBlockWithValue,
  createTestEvent,
} from "../../tests/tests.helper";
import { VariableTypes } from "../../core/blockly/dto/variable.type";
import { connectToArduinoBlock } from "../../core/blockly/helpers/block.helper";
import { eventToFrameFactory } from "../../core/frames/event-to-frame.factory";

describe("logic not blocks", () => {
  let workspace: Workspace;

  afterEach(() => {
    workspace.dispose();
  });

  beforeEach(() => {
    [workspace] = createArduinoAndWorkSpace();
  });

  it("logic not block should turn a true value to a false value and if nothing is connect will return a true value", () => {
    const boolTest = createSetVariableBlockWithValue(
      workspace,
      "bool_test",
      VariableTypes.BOOLEAN,
      true
    );

    const notBlock = workspace.newBlock("logic_negate");
    boolTest.getInput("VALUE").connection.connect(notBlock.outputConnection);
    connectToArduinoBlock(boolTest);
    // testing true turns to false
    const event1 = createTestEvent(boolTest.id);
    const [event1state1] = eventToFrameFactory(event1).frames;
    expect(event1state1.variables["bool_test"].value).toBeFalsy();

    // Testing false turns to true
    boolTest
      .getInput("VALUE")
      .connection.targetBlock()
      .getInput("BOOL")
      .connection.targetBlock()
      .setFieldValue("FALSE", "BOOL");

    const event2 = createTestEvent(boolTest.id);
    const [event2state1] = eventToFrameFactory(event2).frames;
    expect(event2state1.variables["bool_test"].value).toBeTruthy();

    // testing not block connected
    boolTest
      .getInput("VALUE")
      .connection.targetBlock()
      .getInput("BOOL")
      .connection.targetBlock()
      .dispose(true);
    const event3 = createTestEvent(boolTest.id);
    const [event3state1] = eventToFrameFactory(event3).frames;
    expect(event3state1.variables["bool_test"].value).toBeTruthy();
  });
});
