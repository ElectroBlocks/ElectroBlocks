import "jest";
import "../../../blocks";
import Blockly, { Workspace, BlockSvg, WorkspaceSvg, Blocks } from "blockly";
import { getAllBlocks } from "../../../helpers/block.helper";
import _ from "lodash";
import { BlockEvent } from "../../../dto/event.type";
import { transformBlock } from "../../../transformers/block.transformer";
import { getAllVariables } from "../../../helpers/variable.helper";
import { transformVariable } from "../../../transformers/variables.transformer";
import { ActionType } from "../../actions";
import { disableSetupBlocksUsingSamePinNumbers } from "./disableSetupBlocksUsingSamePinNumbers";
import {
  createArduinoAndWorkSpace,
  createTestEvent,
} from "../../../../../tests/tests.helper";
import { MicroControllerType } from "../../../../microcontroller/microcontroller";

describe("disableSetupBlocksUsingSamePinNumbers", () => {
  let workspace: Workspace;
  let arduinoBlock;

  beforeEach(() => {
    [workspace, arduinoBlock] = createArduinoAndWorkSpace();
  });

  afterEach(() => {
    workspace.dispose();
  });

  test("should disble blocks with NO_PINS in the pin dropdown", () => {
    workspace.newBlock("analog_read_setup");
    workspace.newBlock("analog_read_setup");
    workspace.newBlock("analog_read_setup");
    workspace.newBlock("analog_read_setup");
    workspace.newBlock("analog_read_setup");
    workspace.newBlock("analog_read_setup");
    workspace.newBlock("analog_read_setup"); // because there are only 6 analog pins the last block should be disabled

    const event = createTestEvent(arduinoBlock.id);
    const actions = disableSetupBlocksUsingSamePinNumbers(event);
    expect(actions.length).toBe(1);
    expect(actions[0].blockId).toBeDefined();
    expect(actions[0].warningText).toBeDefined();
    expect(actions[0].type).toBe(ActionType.DISABLE_BLOCK);
  });
});
