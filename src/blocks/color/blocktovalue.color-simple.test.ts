import { describe, it, beforeEach, afterEach, expect } from "vitest";

import "../../core/blockly/blocks";
import "../../tests/fake-block";

import type { BlockSvg, Workspace } from "blockly";
import { VariableTypes } from "../../core/blockly/dto/variable.type";
import { connectToArduinoBlock } from "../../core/blockly/helpers/block.helper";
import type { Color } from "../../core/frames/arduino.frame";
import { eventToFrameFactory } from "../../core/frames/event-to-frame.factory";
import {
  createArduinoAndWorkSpace,
  createSetVariableBlockWithValue,
  createTestEvent,
  verifyVariable,
} from "../../tests/tests.helper";

describe("simple color state factories", () => {
  let workspace: Workspace;
  let arduinoBlock: BlockSvg;

  afterEach(() => {
    workspace.dispose();
  });

  beforeEach(() => {
    [workspace, arduinoBlock] = createArduinoAndWorkSpace();
  });

  it("test color picker block gives the right rgb value", () => {
    const colorPickerVariable = createSetVariableBlockWithValue(
      workspace,
      "color_test",
      VariableTypes.COLOUR,
      { red: 92, green: 230, blue: 147 }
    );
    connectToArduinoBlock(colorPickerVariable);

    const event = createTestEvent(colorPickerVariable.id);
    const [state1event1] = eventToFrameFactory(event).frames;

    expect(state1event1.explanation).toBe(
      'Variable "color_test" stores (red=92,green=230,blue=147).'
    );
    verifyVariable(
      "color_test",
      VariableTypes.COLOUR,
      { red: 92, green: 230, blue: 147 },
      state1event1.variables
    );

    const randomColorBlock = workspace.newBlock("colour_random");
    colorPickerVariable
      .getInput("VALUE")
      .connection.targetBlock()
      .dispose(true);
    colorPickerVariable
      .getInput("VALUE")
      .connection.connect(randomColorBlock.outputConnection);

    const event2 = createTestEvent(colorPickerVariable.id);
    const [state1event2] = eventToFrameFactory(event2).frames;

    expect(state1event1.explanation).toContain(
      'Variable "color_test" stores (red='
    );
    const color = state1event2.variables["color_test"].value as Color;
    expect(color).toBeDefined();
    expect(color.blue > 0).toBeTruthy();
    expect(color.red > 0).toBeTruthy();
    expect(color.green > 0).toBeTruthy();
  });
});
