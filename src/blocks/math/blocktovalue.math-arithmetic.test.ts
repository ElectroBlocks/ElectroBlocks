import { describe, it, beforeEach, afterEach, expect } from "vitest";

import "../../core/blockly/blocks";
import {
  createArduinoAndWorkSpace,
  createSetVariableBlockWithValue,
  createTestEvent,
} from "../../tests/tests.helper";
import Blockly, { Workspace, BlockSvg } from "blockly";
import { VariableTypes } from "../../core/blockly/dto/variable.type";
import type { BlockEvent } from "../../core/blockly/dto/event.type";
import {
  getAllBlocks,
  connectToArduinoBlock,
} from "../../core/blockly/helpers/block.helper";
import { transformBlock } from "../../core/blockly/transformers/block.transformer";
import { getAllVariables } from "../../core/blockly/helpers/variable.helper";
import { transformVariable } from "../../core/blockly/transformers/variables.transformer";
import { eventToFrameFactory } from "../../core/frames/event-to-frame.factory";
import _ from "lodash";

describe("math_arithmetic state factories", () => {
  let workspace: Workspace;
  let arduinoBlock: BlockSvg;

  afterEach(() => {
    workspace.dispose();
  });

  beforeEach(() => {
    [workspace, arduinoBlock] = createArduinoAndWorkSpace();
  });

  it("math_arithmetic block should be able to add/subtract/multiply/divide 2 math_number blocks together", () => {
    arduinoBlock.setFieldValue("1", "LOOP_TIMES");
    const variableNumTest = workspace.createVariable("num_test", "Number");
    const setNumberBlock = workspace.newBlock(
      "variables_set_number"
    ) as BlockSvg;
    setNumberBlock.setFieldValue(variableNumTest.getId(), "VAR");

    const mathOperatorBlock = workspace.newBlock("math_arithmetic");
    const aBlock = workspace.newBlock("math_number");
    aBlock.setFieldValue("30", "NUM");
    const bBlock = workspace.newBlock("math_number");
    bBlock.setFieldValue("2", "NUM");
    mathOperatorBlock.getInput("A").connection.connect(aBlock.outputConnection);
    mathOperatorBlock.getInput("B").connection.connect(bBlock.outputConnection);
    setNumberBlock
      .getInput("VALUE")
      .connection.connect(mathOperatorBlock.outputConnection);
    connectToArduinoBlock(setNumberBlock);

    [
      { OP: "ADD", value: 32 },
      { OP: "MINUS", value: 28 },
      { OP: "MULTIPLY", value: 60 },
      { OP: "DIVIDE", value: 15 },
    ].forEach((obj) => {
      mathOperatorBlock.setFieldValue(obj.OP, "OP");

      const event = createTestEvent(mathOperatorBlock.id);
      const [state] = eventToFrameFactory(event).frames;
      expect(state.explanation).toBe(
        `Variable "num_test" stores ${obj.value}.`
      );
      expect(state.variables["num_test"].value).toBe(obj.value);
      expect(_.keys(state.variables).length).toBe(1);
    });
  });

  it("math_arithmetic block should be able to add add/subtract/multiply/divide variables together", () => {
    arduinoBlock.setFieldValue("1", "LOOP_TIMES");
    const setNumberBlocka = createSetVariableBlockWithValue(
      workspace,
      "num_varA",
      VariableTypes.NUMBER,
      30
    );

    const setNumberBlockB = createSetVariableBlockWithValue(
      workspace,
      "num_varB",
      VariableTypes.NUMBER,
      2
    );
    const variableNumTest = workspace.createVariable("num_test", "Number");
    const setNumberBlock = workspace.newBlock(
      "variables_set_number"
    ) as BlockSvg;
    setNumberBlock.setFieldValue(variableNumTest.getId(), "VAR");
    const mathOperatorBlock = workspace.newBlock("math_arithmetic");

    const getNumberBlockA = workspace.newBlock(
      "variables_get_number"
    ) as BlockSvg;

    getNumberBlockA.setFieldValue(setNumberBlocka.getFieldValue("VAR"), "VAR");
    const getNumberBlockB = workspace.newBlock(
      "variables_get_number"
    ) as BlockSvg;

    getNumberBlockB.setFieldValue(setNumberBlockB.getFieldValue("VAR"), "VAR");

    mathOperatorBlock
      .getInput("A")
      .connection.connect(getNumberBlockA.outputConnection);
    mathOperatorBlock
      .getInput("B")
      .connection.connect(getNumberBlockB.outputConnection);
    setNumberBlock
      .getInput("VALUE")
      .connection.connect(mathOperatorBlock.outputConnection);

    connectToArduinoBlock(setNumberBlock);
    connectToArduinoBlock(setNumberBlockB);
    connectToArduinoBlock(setNumberBlocka);
    [
      { OP: "ADD", value: 32 },
      { OP: "MINUS", value: 28 },
      { OP: "MULTIPLY", value: 60 },
      { OP: "DIVIDE", value: 15 },
    ].forEach((obj) => {
      mathOperatorBlock.setFieldValue(obj.OP, "OP");

      const event = createTestEvent(setNumberBlock.id);
      const [state1, state2, state3] = eventToFrameFactory(event).frames;
      expect(state3.explanation).toBe(
        `Variable "num_test" stores ${obj.value}.`
      );
      expect(state3.variables["num_test"].value).toBe(obj.value);
      expect(_.keys(state1.variables).length).toBe(1);
      expect(_.keys(state2.variables).length).toBe(2);
      expect(_.keys(state3.variables).length).toBe(3);
    });
  });

  it("math_arithmetic block should be able to add add/subtract/multiply/divide if nothing is connectted to A or B", () => {
    arduinoBlock.setFieldValue("1", "LOOP_TIMES");
    const variableNumTest = workspace.createVariable("num_test", "Number");
    const setNumberBlock = workspace.newBlock(
      "variables_set_number"
    ) as BlockSvg;
    setNumberBlock.setFieldValue(variableNumTest.getId(), "VAR");

    const mathOperatorBlock = workspace.newBlock("math_arithmetic");
    setNumberBlock
      .getInput("VALUE")
      .connection.connect(mathOperatorBlock.outputConnection);

    connectToArduinoBlock(setNumberBlock);

    [
      { OP: "ADD", value: 0 },
      { OP: "MINUS", value: 0 },
      { OP: "MULTIPLY", value: 0 },
    ].forEach((obj) => {
      mathOperatorBlock.setFieldValue(obj.OP, "OP");

      const event = createTestEvent(setNumberBlock.id);
      const [state] = eventToFrameFactory(event).frames;
      expect(state.explanation).toBe(
        `Variable "num_test" stores ${obj.value}.`
      );
      expect(state.variables["num_test"].value).toBe(obj.value);
    });
  });
});
