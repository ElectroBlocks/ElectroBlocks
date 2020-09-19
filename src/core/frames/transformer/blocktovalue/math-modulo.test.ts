import "jest";
import "../../../blockly/blocks";
import {
  createArduinoAndWorkSpace,
  createSetVariableBlockWithValue,
  createTestEvent,
} from "../../../../tests/tests.helper";
import Blockly, { Workspace, BlockSvg } from "blockly";
import { VariableTypes } from "../../../blockly/dto/variable.type";
import { BlockEvent } from "../../../blockly/dto/event.type";
import {
  getAllBlocks,
  connectToArduinoBlock,
} from "../../../blockly/helpers/block.helper";
import { transformBlock } from "../../../blockly/transformers/block.transformer";
import { getAllVariables } from "../../../blockly/helpers/variable.helper";
import { transformVariable } from "../../../blockly/transformers/variables.transformer";
import { eventToFrameFactory } from "../../event-to-frame.factory";
import _ from "lodash";

describe("math_modulo state factories", () => {
  let workspace: Workspace;

  afterEach(() => {
    workspace.dispose();
  });

  beforeEach(() => {
    [workspace] = createArduinoAndWorkSpace();
  });

  test("math_modulo block should be able to 2 math_number blocks together", () => {
    const variableNumTest = workspace.createVariable("num_test", "Number");
    const setNumberBlock = workspace.newBlock(
      "variables_set_number"
    ) as BlockSvg;
    setNumberBlock.setFieldValue(variableNumTest.getId(), "VAR");

    const modulusBlock = workspace.newBlock("math_modulo");
    const dividend = workspace.newBlock("math_number");
    dividend.setFieldValue("30", "NUM");
    const divisor = workspace.newBlock("math_number");
    divisor.setFieldValue("4", "NUM");
    modulusBlock
      .getInput("DIVIDEND")
      .connection.connect(dividend.outputConnection);
    modulusBlock
      .getInput("DIVISOR")
      .connection.connect(divisor.outputConnection);
    setNumberBlock
      .getInput("VALUE")
      .connection.connect(modulusBlock.outputConnection);
    connectToArduinoBlock(setNumberBlock);

    const event = createTestEvent(modulusBlock.id);

    const [state] = eventToFrameFactory(event).frames;
    expect(state.explanation).toBe(`Variable "num_test" stores 2.`);
    expect(state.variables["num_test"].value).toBe(2);
    expect(_.keys(state.variables).length).toBe(1);
  });

  test("math_modulo block should be able to 2 variables blocks together", () => {
    const variableNumTest = workspace.createVariable("num_test", "Number");
    const setNumberBlock = workspace.newBlock(
      "variables_set_number"
    ) as BlockSvg;
    setNumberBlock.setFieldValue(variableNumTest.getId(), "VAR");

    const dividendBlock = createSetVariableBlockWithValue(
      workspace,
      "dividend",
      VariableTypes.NUMBER,
      30
    );

    const divisorBlock = createSetVariableBlockWithValue(
      workspace,
      "divisor",
      VariableTypes.NUMBER,
      2
    );

    const getDividendBlock = workspace.newBlock(
      "variables_get_number"
    ) as BlockSvg;

    getDividendBlock.setFieldValue(dividendBlock.getFieldValue("VAR"), "VAR");
    const getDivisorBlock = workspace.newBlock(
      "variables_get_number"
    ) as BlockSvg;

    getDivisorBlock.setFieldValue(divisorBlock.getFieldValue("VAR"), "VAR");
    const modulusBlock = workspace.newBlock("math_modulo");
    modulusBlock
      .getInput("DIVIDEND")
      .connection.connect(getDividendBlock.outputConnection);
    modulusBlock
      .getInput("DIVISOR")
      .connection.connect(getDivisorBlock.outputConnection);
    setNumberBlock
      .getInput("VALUE")
      .connection.connect(modulusBlock.outputConnection);

    connectToArduinoBlock(setNumberBlock);
    connectToArduinoBlock(dividendBlock);
    connectToArduinoBlock(divisorBlock);

    const event = createTestEvent(setNumberBlock.id);

    const [state1, state2, state3] = eventToFrameFactory(event).frames;
    expect(state3.variables["num_test"].value).toBe(0);
    expect(_.keys(state1.variables).length).toBe(1);
    expect(_.keys(state2.variables).length).toBe(2);
    expect(_.keys(state3.variables).length).toBe(3);
  });

  test("math_modulo block should be able to modulus if nothing is connectted", () => {
    const variableNumTest = workspace.createVariable("num_test", "Number");
    const setNumberBlock = workspace.newBlock(
      "variables_set_number"
    ) as BlockSvg;
    setNumberBlock.setFieldValue(variableNumTest.getId(), "VAR");
    const modulusBlock = workspace.newBlock("math_modulo");
    setNumberBlock
      .getInput("VALUE")
      .connection.connect(modulusBlock.outputConnection);
    connectToArduinoBlock(setNumberBlock);
    const event = createTestEvent(setNumberBlock.id);

    const [state] = eventToFrameFactory(event).frames;
    expect(state.explanation).toBe(`Variable "num_test" stores 0.`);
    expect(state.variables["num_test"].value).toBe(0);
    expect(_.keys(state.variables).length).toBe(1);
  });
});
