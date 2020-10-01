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

describe("factories debug state", () => {
  let workspace: Workspace;

  afterEach(() => {
    workspace.dispose();
  });

  beforeEach(() => {
    [workspace] = createArduinoAndWorkSpace();
  });

  test("should create debug state with all variables and components", () => {
    const debugBlock = workspace.newBlock("debug_block") as BlockSvg;
    connectToArduinoBlock(debugBlock);
    const numberVarBlock = createSetVariableBlockWithValue(
      workspace,
      "var1",
      VariableTypes.NUMBER,
      33
    );
    connectToArduinoBlock(numberVarBlock);

    const event = createTestEvent(numberVarBlock.id);

    const [state1, state2] = eventToFrameFactory(event).frames;

    expect(state2.blockId).toBe(debugBlock.id);
    expect(state2.explanation).toBe("Debug [will pause in Arduino Code.]");
    expect(state1.variables["var1"].value).toBe(33);
  });
});
