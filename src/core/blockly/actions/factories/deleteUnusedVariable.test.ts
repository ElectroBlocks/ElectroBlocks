import "jest";
import "../../blocks";
import Blockly, { Workspace, BlockSvg, WorkspaceSvg, Blocks } from "blockly";
import { getAllBlocks } from "../../helpers/block.helper";
import _ from "lodash";
import { BlockEvent } from "../../dto/event.type";
import { transformBlock } from "../../transformers/block.transformer";
import { deleteUnusedVariables } from "./deleteUnusedVariables";
import { getAllVariables } from "../../helpers/variable.helper";
import { transformVariable } from "../../transformers/variables.transformer";
import {
  createArduinoAndWorkSpace,
  createTestEvent,
} from "../../../../tests/tests.helper";
import { MicroControllerType } from "../../../microcontroller/microcontroller";

describe("deleteUnusedVariables", () => {
  let workspace: Workspace;
  let arduinoBlock;

  beforeEach(() => {
    [workspace, arduinoBlock] = createArduinoAndWorkSpace();
  });

  afterEach(() => {
    workspace.dispose();
  });

  test("should create delete variable actions for unused variables", () => {
    const b = workspace.createVariable("var_b", "Number");
    const c = workspace.createVariable("var_c", "String");
    workspace.newBlock("variables_set_number");
    expect(getAllVariables().length).toBe(3);
    const event = createTestEvent(arduinoBlock.id, Blockly.Events.BLOCK_DELETE);

    const actions = deleteUnusedVariables(event);
    expect(actions.length).toBe(2);
    const bAction = actions.find((d) => d.variableId == b.getId());
    expect(bAction).toBeDefined();
    expect(bAction.actionType).toBe("delete");

    const cAction = actions.find((d) => d.variableId == c.getId());
    expect(cAction).toBeDefined();
    expect(cAction.actionType).toBe("delete");
  });
});
