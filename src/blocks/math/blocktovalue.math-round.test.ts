import { describe, it, beforeEach, afterEach, expect } from "vitest";

import "../../core/blockly/blocks";
import _ from "lodash";
import type { BlockSvg, Workspace } from "blockly";
import {
  createArduinoAndWorkSpace,
  createSetVariableBlockWithValue,
  createTestEvent,
} from "../../tests/tests.helper";
import { VariableTypes } from "../../core/blockly/dto/variable.type";
import { connectToArduinoBlock } from "../../core/blockly/helpers/block.helper";
import { eventToFrameFactory } from "../../core/frames/event-to-frame.factory";

describe("math_round state factories", () => {
  let workspace: Workspace;
  let arduinoBlock: BlockSvg;

  afterEach(() => {
    workspace.dispose();
  });

  beforeEach(() => {
    [workspace, arduinoBlock] = createArduinoAndWorkSpace();
  });

  it("math_round block should be able to roundup/round/rounddown math_number blocks together", () => {
    arduinoBlock.setFieldValue("1", "LOOP_TIMES");
    const variableNumTest = workspace.createVariable("num_test", "Number");
    const setNumberBlock = workspace.newBlock(
      "variables_set_number"
    ) as BlockSvg;
    setNumberBlock.setFieldValue(variableNumTest.getId(), "VAR");

    const mathRoundBlock = workspace.newBlock("math_round");
    const numberBlock = workspace.newBlock("math_number");
    numberBlock.setFieldValue("3.7", "NUM");
    mathRoundBlock
      .getInput("NUM")
      .connection.connect(numberBlock.outputConnection);
    setNumberBlock
      .getInput("VALUE")
      .connection.connect(mathRoundBlock.outputConnection);
    connectToArduinoBlock(setNumberBlock);

    [
      { OP: "ROUND", value: 4 },
      { OP: "ROUNDUP", value: 4 },
      { OP: "ROUNDDOWN", value: 3 },
    ].forEach((obj) => {
      mathRoundBlock.setFieldValue(obj.OP, "OP");

      const event = createTestEvent(setNumberBlock.id);
      const [state] = eventToFrameFactory(event).frames;
      expect(state.explanation).toBe(
        `Variable "num_test" stores ${obj.value}.`
      );
      expect(state.variables["num_test"].value).toBe(obj.value);
      expect(_.keys(state.variables).length).toBe(1);
    });
  });

  it("math_round block should be able to roundup/round/rounddown variable", () => {
    arduinoBlock.setFieldValue("1", "LOOP_TIMES");

    const setNumberRoundBlock = createSetVariableBlockWithValue(
      workspace,
      "num_varB",
      VariableTypes.NUMBER,
      3.4
    );
    const variableNumTest = workspace.createVariable("num_test", "Number");
    const setNumberBlock = workspace.newBlock(
      "variables_set_number"
    ) as BlockSvg;
    setNumberBlock.setFieldValue(variableNumTest.getId(), "VAR");
    const mathRoundBlock = workspace.newBlock("math_round");

    const getNumberBlock = workspace.newBlock(
      "variables_get_number"
    ) as BlockSvg;

    getNumberBlock.setFieldValue(
      setNumberRoundBlock.getFieldValue("VAR"),
      "VAR"
    );

    mathRoundBlock
      .getInput("NUM")
      .connection.connect(getNumberBlock.outputConnection);

    setNumberBlock
      .getInput("VALUE")
      .connection.connect(mathRoundBlock.outputConnection);
    connectToArduinoBlock(setNumberBlock);
    connectToArduinoBlock(setNumberRoundBlock);
    [
      { OP: "ROUND", value: 3 },
      { OP: "ROUNDUP", value: 4 },
      { OP: "ROUNDDOWN", value: 3 },
    ].forEach((obj) => {
      mathRoundBlock.setFieldValue(obj.OP, "OP");

      const event = createTestEvent(setNumberBlock.id);
      const [state1, state2] = eventToFrameFactory(event).frames;
      expect(state2.explanation).toBe(
        `Variable "num_test" stores ${obj.value}.`
      );
      expect(state2.variables["num_test"].value).toBe(obj.value);
      expect(_.keys(state1.variables).length).toBe(1);
      expect(_.keys(state2.variables).length).toBe(2);
    });
  });

  it("math_round block should be able to round if nothing is connectted it", () => {
    arduinoBlock.setFieldValue("1", "LOOP_TIMES");
    const variableNumTest = workspace.createVariable("num_test", "Number");
    const setNumberBlock = workspace.newBlock(
      "variables_set_number"
    ) as BlockSvg;
    setNumberBlock.setFieldValue(variableNumTest.getId(), "VAR");

    const mathRoundBlock = workspace.newBlock("math_round");
    setNumberBlock
      .getInput("VALUE")
      .connection.connect(mathRoundBlock.outputConnection);

    connectToArduinoBlock(setNumberBlock);

    [
      { OP: "ROUND", value: 1 },
      { OP: "ROUNDUP", value: 1 },
      { OP: "ROUNDDOWN", value: 1 },
    ].forEach((obj) => {
      mathRoundBlock.setFieldValue(obj.OP, "OP");

      const event = createTestEvent(setNumberBlock.id);
      const [state] = eventToFrameFactory(event).frames;
      expect(state.explanation).toBe(
        `Variable "num_test" stores ${obj.value}.`
      );
      expect(state.variables["num_test"].value).toBe(obj.value);
    });
  });
});
