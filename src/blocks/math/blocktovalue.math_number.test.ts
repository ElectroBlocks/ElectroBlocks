import { describe, it, beforeEach, afterEach, expect } from "vitest";

import "../../core/blockly/blocks";
import {
  createArduinoAndWorkSpace,
  createTestEvent,
} from "../../tests/tests.helper";
import { Workspace, BlockSvg } from "blockly";
import { connectToArduinoBlock } from "../../core/blockly/helpers/block.helper";
import { eventToFrameFactory } from "../../core/frames/event-to-frame.factory";
import _ from "lodash";

describe("math_number_property state factories", () => {
  let workspace: Workspace;
  let arduinoBlock: BlockSvg;
  let variableBoolTest;
  let setBooleanBlock;
  let mathPropertyBlock;
  let numBlock;

  afterEach(() => {
    workspace.dispose();
  });

  beforeEach(() => {
    [workspace, arduinoBlock] = createArduinoAndWorkSpace();
    arduinoBlock.setFieldValue("1", "LOOP_TIMES");
    variableBoolTest = workspace.createVariable("bool_test", "Boolean");
    setBooleanBlock = workspace.newBlock("variables_set_boolean") as BlockSvg;
    setBooleanBlock.setFieldValue(variableBoolTest.getId(), "VAR");

    mathPropertyBlock = workspace.newBlock("math_number_property");
    numBlock = workspace.newBlock("math_number");
    mathPropertyBlock
      .getInput("NUMBER_TO_CHECK")
      .connection.connect(numBlock.outputConnection);
    setBooleanBlock
      .getInput("VALUE")
      .connection.connect(mathPropertyBlock.outputConnection);
    connectToArduinoBlock(setBooleanBlock);
  });

  it("math_number_property block should be able to even/odd/positive/negative", () => {
    [
      { OP: "EVEN", num: 3, value: false },
      { OP: "EVEN", num: 4, value: true },
      { OP: "ODD", num: 3, value: true },
      { OP: "ODD", num: 4, value: false },
      { OP: "POSITIVE", num: 3, value: true },
      { OP: "POSITIVE", num: -4, value: false },
      { OP: "NEGATIVE", num: -3, value: true },
      { OP: "NEGATIVE", num: 4, value: false },
    ].forEach((obj) => {
      numBlock.setFieldValue(obj.num, "NUM");

      mathPropertyBlock.setFieldValue(obj.OP, "PROPERTY");

      const event = createTestEvent(mathPropertyBlock.id);
      const [state] = eventToFrameFactory(event).frames;
      expect(state.explanation).toBe(
        `Variable "bool_test" stores ${obj.value}.`
      );
      expect(state.variables["bool_test"].value).toBe(obj.value);
      expect(_.keys(state.variables).length).toBe(1);
    });
  });

  it("should be able to do a divisor", () => {
    mathPropertyBlock.setFieldValue("DIVISIBLE_BY", "PROPERTY");
    const numDivisorBlock = workspace.newBlock("math_number");
    mathPropertyBlock
      .getInput("DIVISOR")
      .connection.connect(numDivisorBlock.outputConnection);

    [
      { DIVIDEND: 20, DIVISOR: 3, canDivide: false },
      { DIVIDEND: 44, DIVISOR: 11, canDivide: true },
    ].forEach((obj) => {
      numBlock.setFieldValue(obj.DIVIDEND, "NUM");
      numDivisorBlock.setFieldValue(obj.DIVISOR, "NUM");
      const event = createTestEvent(mathPropertyBlock.id);
      const [state] = eventToFrameFactory(event).frames;
      expect(state.explanation).toBe(
        `Variable "bool_test" stores ${obj.canDivide}.`
      );
      expect(state.variables["bool_test"].value).toBe(obj.canDivide);
      expect(_.keys(state.variables).length).toBe(1);
    });
  });

  it("should throw error if an unknown option is present", () => {
    mathPropertyBlock.setFieldValue("PRIME", "PROPERTY");
    const event = createTestEvent(mathPropertyBlock.id);
    expect(eventToFrameFactory).toThrowError();
    eventToFrameFactory(event).frames;
  });
});
