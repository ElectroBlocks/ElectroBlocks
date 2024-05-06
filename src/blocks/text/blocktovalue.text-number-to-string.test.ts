import type { BlockSvg, Workspace } from "blockly";
import { describe, it, beforeEach, afterEach, expect } from "vitest";

import "../../core/blockly/blocks";
import { VariableTypes } from "../../core/blockly/dto/variable.type";
import { connectToArduinoBlock } from "../../core/blockly/helpers/block.helper";
import { eventToFrameFactory } from "../../core/frames/event-to-frame.factory";
import {
  createArduinoAndWorkSpace,
  createSetVariableBlockWithValue,
  createTestEvent,
} from "../../tests/tests.helper";

describe("number_to_string state factories", () => {
  let workspace: Workspace;
  let arduinoBlock: BlockSvg;

  afterEach(() => {
    workspace.dispose();
  });

  beforeEach(() => {
    [workspace, arduinoBlock] = createArduinoAndWorkSpace();
  });

  it("should be able be able change a number variable/text block/empty to a text", () => {
    const numberToTextBlock = workspace.newBlock("number_to_string");
    numberToTextBlock.setFieldValue("3", "PRECISION");

    const numberBlock = workspace.newBlock("math_number");
    numberBlock.setFieldValue("93.999323", "NUM");

    numberToTextBlock
      .getInput("NUMBER")
      .connection.connect(numberBlock.outputConnection);

    const setTextBlock = createSetVariableBlockWithValue(
      workspace,
      "text_test",
      VariableTypes.STRING,
      ""
    );
    const textBlockToRemove = setTextBlock
      .getInput("VALUE")
      .connection.targetBlock();
    textBlockToRemove.dispose(true);

    setTextBlock
      .getInput("VALUE")
      .connection.connect(numberToTextBlock.outputConnection);

    connectToArduinoBlock(setTextBlock);

    const event1 = createTestEvent(setTextBlock.id);

    const [state1Event1] = eventToFrameFactory(event1).frames;

    expect(state1Event1.explanation).toBe(
      'Variable "text_test" stores "93.999".'
    );
    expect(state1Event1.variables["text_test"].value).toBe("93.999");

    numberBlock.dispose(true);

    const setNumberVariable = createSetVariableBlockWithValue(
      workspace,
      "num",
      VariableTypes.NUMBER,
      "333.33399"
    );

    connectToArduinoBlock(setNumberVariable);

    const getNumberVariable = workspace.newBlock("variables_get_number");
    getNumberVariable.setFieldValue(
      setNumberVariable.getFieldValue("VAR"),
      "VAR"
    );

    numberToTextBlock
      .getInput("NUMBER")
      .connection.connect(getNumberVariable.outputConnection);

    const event2 = createTestEvent(numberBlock.id);

    const [state1Event2, state2Event2] = eventToFrameFactory(event2).frames;

    expect(state2Event2.explanation).toBe(
      'Variable "text_test" stores "333.334".'
    );
    expect(state2Event2.variables["text_test"].value).toBe("333.334");

    getNumberVariable.dispose(true);
    setNumberVariable.dispose(true);

    const event3 = createTestEvent(setNumberVariable.id);

    const [state1Event3] = eventToFrameFactory(event3).frames;

    expect(state1Event3.explanation).toBe(
      'Variable "text_test" stores "0.000".'
    );
    expect(state1Event3.variables["text_test"].value).toBe("0.000");
  });
});
