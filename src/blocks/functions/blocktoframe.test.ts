import "jest";
import "../../core/blockly/blocks";
import Blockly, { Workspace, BlockSvg } from "blockly";
import {
  createArduinoAndWorkSpace,
  createSetVariableBlockWithValue,
  createTestEvent,
} from "../../tests/tests.helper";
import {
  connectToArduinoBlock,
  getAllBlocks,
} from "../../core/blockly/helpers/block.helper";
import { VariableTypes } from "../../core/blockly/dto/variable.type";
import { BlockEvent } from "../../core/blockly/dto/event.type";
import { transformBlock } from "../../core/blockly/transformers/block.transformer";
import { getAllVariables } from "../../core/blockly/helpers/variable.helper";
import { transformVariable } from "../../core/blockly/transformers/variables.transformer";
import { eventToFrameFactory } from "../../core/frames/event-to-frame.factory";
import { MicroControllerType } from "../../core/microcontroller/microcontroller";

describe("generate states for functions", () => {
  let workspace: Workspace;
  let arduinoBlock: BlockSvg;

  afterEach(() => {
    workspace.dispose();
  });

  beforeEach(() => {
    [workspace, arduinoBlock] = createArduinoAndWorkSpace();
    arduinoBlock.setFieldValue("1", "LOOP_TIMES");
  });

  test("should be able to create an call a function", () => {
    const functionBlock = workspace.newBlock("procedures_defnoreturn");
    functionBlock.setFieldValue("funcName", "NAME");
    const debugBlock = workspace.newBlock("debug_block");
    functionBlock
      .getInput("STACK")
      .connection.connect(debugBlock.previousConnection);

    const funcCallBlock = workspace.newBlock(
      "procedures_callnoreturn"
    ) as BlockSvg;
    funcCallBlock.setFieldValue("funcName", "NAME");
    connectToArduinoBlock(funcCallBlock);

    const event = createTestEvent(funcCallBlock.id);

    const states = eventToFrameFactory(event).frames;
    expect(states.length).toBe(2);
    const [state1, state2] = states;
    expect(state1.blockId).toBe(funcCallBlock.id);
    expect(state1.explanation).toBe("Calling function funcName.");
    expect(state2.blockId).toBe(debugBlock.id);
  });
});
