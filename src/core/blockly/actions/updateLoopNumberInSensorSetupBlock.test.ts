import { describe, it, beforeEach, afterEach, expect } from "vitest";

import "../blocks";
import Blockly, { BlockSvg } from "blockly";
import { getAllBlocks } from "../helpers/block.helper";
import _ from "lodash";
import type { BlockEvent } from "../dto/event.type";
import { transformBlock } from "../transformers/block.transformer";
import { updateLoopNumberInSensorSetupBlock } from "./updateLoopNumberInSensorSetupBlock";
import { ActionType } from "./actions";
import { getAllVariables } from "../helpers/variable.helper";
import { transformVariable } from "../transformers/variables.transformer";
import {
  createArduinoAndWorkSpace,
  createTestEvent,
} from "../../../tests/tests.helper";
import { MicroControllerType } from "../../microcontroller/microcontroller";

describe("changeLoopNumberInSensorBlock", () => {
  let workspace;
  let arduinoBlock;

  beforeEach(() => {
    [workspace, arduinoBlock] = createArduinoAndWorkSpace();
  });

  afterEach(() => {
    workspace.dispose();
  });

  it("should only change when arduino block has field has changed", () => {
    const block = workspace.newBlock("math_number");
    const event = createTestEvent(block.id, Blockly.Events.UI);
    expect(updateLoopNumberInSensorSetupBlock(event)).toEqual([]);
  });

  it("nothing should happen if no setup sensor blocks are present", () => {
    workspace.newBlock("math_number");
    const event: BlockEvent = {
      blockId: arduinoBlock.id,
      type: Blockly.Events.BLOCK_CHANGE,
      variables: getAllVariables().map(transformVariable),
      blocks: getAllBlocks().map(transformBlock),
      newValue: "2",
      oldValue: "1",
      fieldName: "LOOP_TIMES",
      fieldType: "field",
      microController: MicroControllerType.ARDUINO_UNO,
    };

    expect(updateLoopNumberInSensorSetupBlock(event)).toEqual([]);
  });

  it("should generate actions for sensor setup blocks that have the a higher loop number in the field than the arduino loop block", () => {
    // This done so the generated blocks have 10 loop drop down items
    arduinoBlock.setFieldValue("10", "LOOP_TIMES");

    const ultraSonicSensor = workspace.newBlock(
      "ultra_sonic_sensor_setup"
    ) as BlockSvg;
    ultraSonicSensor.setFieldValue("3", "LOOP");

    const tempSensor = workspace.newBlock("temp_setup") as BlockSvg;
    tempSensor.setFieldValue("6", "LOOP");

    const rfidSensor = workspace.newBlock("rfid_setup") as BlockSvg;
    rfidSensor.setFieldValue("5", "LOOP");

    const event: BlockEvent = {
      blockId: arduinoBlock.id,
      type: Blockly.Events.BLOCK_CHANGE,
      variables: getAllVariables().map(transformVariable),
      blocks: getAllBlocks().map(transformBlock),
      newValue: "4",
      oldValue: "10",
      fieldName: "LOOP_TIMES",
      fieldType: "field",
      microController: MicroControllerType.ARDUINO_UNO,
    };

    const updateBlockActions = updateLoopNumberInSensorSetupBlock(event);
    expect(updateBlockActions.length).toBe(2);

    const updateTempAction = updateBlockActions.find(
      (action) => action.blockId === tempSensor.id
    );
    expect(updateTempAction.loop).toBe(4);
    expect(updateTempAction.type).toBe(
      ActionType.SETUP_SENSOR_BLOCK_LOOP_FIELD_UPDATE
    );

    const updateRfidAction = updateBlockActions.find(
      (action) => action.blockId === rfidSensor.id
    );
    expect(updateRfidAction.loop).toBe(4);
    expect(updateRfidAction.type).toBe(
      ActionType.SETUP_SENSOR_BLOCK_LOOP_FIELD_UPDATE
    );
  });
});
