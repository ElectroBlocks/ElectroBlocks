import { describe, it, beforeEach, afterEach, expect, vi } from "vitest";

import "../blockly/blocks";
import Blockly, { Workspace, BlockSvg, WorkspaceSvg, Blocks } from "blockly";
import * as helpers from "../blockly/helpers/workspace.helper";
import {
  getAllBlocks,
  connectToArduinoBlock,
} from "../blockly/helpers/block.helper";
import _ from "lodash";
import type { BlockEvent } from "../blockly/dto/event.type";
import { transformBlock } from "../blockly/transformers/block.transformer";
import { getAllVariables } from "../blockly/helpers/variable.helper";
import { transformVariable } from "../blockly/transformers/variables.transformer";
import { eventToFrameFactory } from "./event-to-frame.factory";
import { saveSensorSetupBlockData } from "../blockly/actions/saveSensorSetupBlockData";
import { updater } from "../blockly/updater";
import {
  createSetVariableBlockWithValue,
  createTestEvent,
} from "../../tests/tests.helper";
import { VariableTypes } from "../blockly/dto/variable.type";
import { MicroControllerType } from "../microcontroller/microcontroller";
import type { ButtonState } from "../../blocks/button/state";
import { defaultSetting } from "../../firebase/model";

describe("generator", () => {
  let workspace: Workspace;
  let arduinoBlock: BlockSvg;
  let buttonSetup: BlockSvg;
  let arduinoSetupBlock: BlockSvg;

  beforeEach(() => {
    workspace = new Workspace();
    vi.spyOn(helpers, "getWorkspace").mockReturnValue(
      workspace as WorkspaceSvg
    );
    arduinoBlock = workspace.newBlock("arduino_loop") as BlockSvg;
    arduinoSetupBlock = workspace.newBlock("arduino_setup") as BlockSvg;

    buttonSetup = workspace.newBlock("button_setup") as BlockSvg;
    buttonSetup.setFieldValue("3", "PIN");
    buttonSetup.setFieldValue("TRUE", "is_pressed");

    const event = createTestEvent(buttonSetup.id);
    saveSensorSetupBlockData(event).forEach(updater);

    buttonSetup.setFieldValue("2", "LOOP");
    buttonSetup.setFieldValue("2", "LOOP");
    buttonSetup.setFieldValue("FALSE", "is_pressed");

    const event2: BlockEvent = {
      blocks: getAllBlocks().map(transformBlock),
      variables: getAllVariables().map(transformVariable),
      type: Blockly.Events.BLOCK_MOVE,
      blockId: buttonSetup.id,
      microController: MicroControllerType.ARDUINO_UNO,
    };
    saveSensorSetupBlockData(event2).forEach(updater);
  });

  it("should generate zero frames when no blocks other than the loop are present", () => {
    const setNumberBlock = createSetVariableBlockWithValue(
      workspace,
      "num_var",
      VariableTypes.NUMBER,
      30
    );

    const setNumberBlock2 = createSetVariableBlockWithValue(
      workspace,
      "num_var2",
      VariableTypes.NUMBER,
      30
    );

    arduinoBlock
      .getInput("loop")
      .connection.connect(setNumberBlock2.previousConnection);
    connectToArduinoBlock(setNumberBlock);

    const event = createTestEvent(arduinoBlock.id, Blockly.Events.BLOCK_DELETE);
    const states = eventToFrameFactory(event, defaultSetting).frames;
    expect(states.length).toBe(5);
    expect(states[0].blockName).toBe("button_setup");
    expect(states[0].variables["num_var"]).toBeUndefined();
    expect(states[0].variables["num_var2"]).toBeUndefined();

    expect((states[1].components[0] as ButtonState).isPressed).toBeTruthy();
    expect(states[1].variables["num_var"].value).toBe(30);
    expect(states[1].variables["num_var2"]).toBeUndefined();

    expect((states[2].components[0] as ButtonState).isPressed).toBeTruthy();
    expect(states[2].variables["num_var"].value).toBe(30);
    expect(states[2].variables["num_var2"].value).toBe(30);

    expect((states[3].components[0] as ButtonState).isPressed).toBeFalsy();
    expect(states[3].variables["num_var"].value).toBe(30);
    expect(states[3].variables["num_var2"].value).toBe(30);

    expect((states[4].components[0] as ButtonState).isPressed).toBeTruthy();
    expect(states[4].variables["num_var"].value).toBe(30);
    expect(states[4].variables["num_var2"].value).toBe(30);
  });

  it("should be able frames that are in the setup block", () => {});
});
