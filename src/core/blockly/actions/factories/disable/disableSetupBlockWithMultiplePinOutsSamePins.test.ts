import "jest";
import "../../../blocks";
import Blockly, { Workspace, BlockSvg, WorkspaceSvg } from "blockly";
import { getAllBlocks } from "../../../helpers/block.helper";
import _ from "lodash";
import { BlockEvent } from "../../../dto/event.type";
import { transformBlock } from "../../../transformers/block.transformer";
import { getAllVariables } from "../../../helpers/variable.helper";
import { transformVariable } from "../../../transformers/variables.transformer";
import { ActionType } from "../../actions";
import { ARDUINO_PINS } from "../../../../microcontroller/selectBoard";
import { disableSetupBlockWithMultiplePinOutsSamePins } from "./disableSetupBlockWithMultiplePinOutsSamePins";
import {
  createArduinoAndWorkSpace,
  createTestEvent,
} from "../../../../../tests/tests.helper";
import { MicroControllerType } from "../../../../microcontroller/microcontroller";

describe("disableSensorReadBlocksWithWrongPins", () => {
  let workspace: Workspace;
  let arduinoBlock;

  beforeEach(() => {
    [workspace, arduinoBlock] = createArduinoAndWorkSpace();
  });

  afterEach(() => {
    workspace.dispose();
  });

  test("should disable blocks that use same pin twice", () => {
    const rfidBlockSetup = workspace.newBlock("rfid_setup");
    rfidBlockSetup.setFieldValue(ARDUINO_PINS.PIN_5, "TX");

    const setupBlock2 = workspace.newBlock("bluetooth_setup");
    setupBlock2.setFieldValue(ARDUINO_PINS.PIN_10, "TX");
    setupBlock2.setFieldValue(ARDUINO_PINS.PIN_10, "RX");
    const event = createTestEvent(arduinoBlock.id);

    const actions = disableSetupBlockWithMultiplePinOutsSamePins(event);
    expect(actions.length).toBe(1);
    expect(actions[0].blockId).toBe(setupBlock2.id);
    expect(actions[0].warningText).toBeDefined();
    expect(actions[0].type).toBe(ActionType.DISABLE_BLOCK);
  });
});
