import { describe, it, beforeEach, afterEach, expect } from "vitest";

import "../blocks";
import Blockly, { Workspace } from "blockly";
import { getAllBlocks } from "../helpers/block.helper";
import _ from "lodash";
import type { BlockEvent } from "../dto/event.type";
import { transformBlock } from "../transformers/block.transformer";
import { getAllVariables } from "../helpers/variable.helper";
import { transformVariable } from "../transformers/variables.transformer";
import { saveSensorSetupBlockData } from "./saveSensorSetupBlockData";
import { ActionType } from "./actions";
import {
  createArduinoAndWorkSpace,
  createTestEvent,
} from "../../../tests/tests.helper";
import { MicroControllerType } from "../../microcontroller/microcontroller";
import type { MotionSensor } from "../../../blocks/motors/state";

describe("saveSensorSetupBlockData", () => {
  let workspace: Workspace;
  let arduinoBlock;

  beforeEach(() => {
    [workspace, arduinoBlock] = createArduinoAndWorkSpace();
  });

  afterEach(() => {
    workspace.dispose();
  });

  it("no action if block is not a sensor setup block", () => {
    const event = createTestEvent(arduinoBlock.id);
    const actions = saveSensorSetupBlockData(event);
    expect(actions).toEqual([]);
  });

  it("no action if the block loop field is being changed", () => {
    const sensorBlock = workspace.newBlock("rfid_setup");
    const event: BlockEvent = {
      blockId: sensorBlock.id,
      variables: getAllVariables().map(transformVariable),
      blocks: getAllBlocks().map(transformBlock),
      type: Blockly.Events.BLOCK_CHANGE,
      newValue: "2",
      oldValue: "1",
      fieldName: "LOOP",
      fieldType: "field",
      microController: MicroControllerType.ARDUINO_UNO,
    };
    const actions = saveSensorSetupBlockData(event);
    expect(actions).toEqual([]);
  });

  it("create an action for a block with no metadata", () => {
    const sensorBlock = workspace.newBlock("ultra_sonic_sensor_setup");
    const event: BlockEvent = {
      blockId: sensorBlock.id,
      variables: getAllVariables().map(transformVariable),
      blocks: getAllBlocks().map(transformBlock),
      type: Blockly.Events.BLOCK_CHANGE,
      newValue: "2",
      oldValue: "1",
      fieldName: "cm",
      fieldType: "field",
      microController: MicroControllerType.ARDUINO_UNO,
    };

    const expectedData = [
      {
        loop: 1,
        cm: 1,
        blockName: sensorBlock.type,
      },
      {
        loop: 2,
        cm: 1,
        blockName: sensorBlock.type,
      },
      {
        loop: 3,
        cm: 1,
        blockName: sensorBlock.type,
      },
    ];

    const actions = saveSensorSetupBlockData(event);

    expect(JSON.parse(actions[0].data)).toEqual(expectedData);
    expect(actions[0].type).toEqual(
      ActionType.SETUP_SENSOR_BLOCK_SAVE_DEBUG_DATA
    );
    expect(actions[0].blockId).toEqual(sensorBlock.id);
  });

  it("create an action for a block already has metadata.  Should replace what is ther for the loop selected", () => {
    const sensorBlock = workspace.newBlock("ultra_sonic_sensor_setup");
    const currentMetadata = [
      {
        loop: 1,
        cm: 1,
        blockName: sensorBlock.type,
      },
      {
        loop: 2,
        cm: 1,
        blockName: sensorBlock.type,
      },
      {
        loop: 3,
        cm: 1,
        blockName: sensorBlock.type,
      },
    ];

    sensorBlock.setFieldValue("2", "LOOP");
    sensorBlock.data = JSON.stringify(currentMetadata);
    sensorBlock.setFieldValue("10", "cm");
    const event: BlockEvent = {
      blockId: sensorBlock.id,
      variables: getAllVariables().map(transformVariable),
      blocks: getAllBlocks().map(transformBlock),
      type: Blockly.Events.BLOCK_CHANGE,
      newValue: "10",
      oldValue: "1",
      fieldName: "cm",
      fieldType: "field",
      microController: MicroControllerType.ARDUINO_UNO,
    };

    const actions = saveSensorSetupBlockData(event);
    const metadataToSave = JSON.parse(actions[0].data) as MotionSensor[];
    expect(metadataToSave.length).toBe(3);
    metadataToSave.forEach((data) => {
      const expectedcm = data.loop == 2 ? 10 : 1;
      expect(data.cm).toBe(expectedcm);
    });

    expect(actions[0].type).toEqual(
      ActionType.SETUP_SENSOR_BLOCK_SAVE_DEBUG_DATA
    );
    expect(actions[0].blockId).toEqual(sensorBlock.id);
  });

  it("should exclude the time block because there is no loop drop down for it.  Time is consider constant through the loop", () => {
    const sensorBlock = workspace.newBlock("time_setup");
    const event: BlockEvent = {
      blockId: sensorBlock.id,
      variables: getAllVariables().map(transformVariable),
      blocks: getAllBlocks().map(transformBlock),
      type: Blockly.Events.BLOCK_CHANGE,
      newValue: "2",
      oldValue: "1",
      fieldName: "time_in_seconds",
      fieldType: "field",
      microController: MicroControllerType.ARDUINO_UNO,
    };
    const actions = saveSensorSetupBlockData(event);
    expect(actions).toEqual([]);
  });

  it("copies all sensor values if COPY_SAME field is checked", () => {
    const sensorBlock = workspace.newBlock("ultra_sonic_sensor_setup");
    sensorBlock.setFieldValue("TRUE", "COPY_SAME");
    sensorBlock.setFieldValue("2", "cm");

    const currentMetadata = [
      {
        loop: 1,
        cm: 1,
        blockName: sensorBlock.type,
      },
      {
        loop: 2,
        cm: 1,
        blockName: sensorBlock.type,
      },
      {
        loop: 3,
        cm: 1,
        blockName: sensorBlock.type,
      },
    ];

    sensorBlock.data = JSON.stringify(currentMetadata);

    const event: BlockEvent = {
      blockId: sensorBlock.id,
      variables: getAllVariables().map(transformVariable),
      blocks: getAllBlocks().map(transformBlock),
      type: Blockly.Events.BLOCK_CHANGE,
      newValue: "2",
      oldValue: "1",
      fieldName: "cm",
      fieldType: "field",
      microController: MicroControllerType.ARDUINO_UNO,
    };

    const actions = saveSensorSetupBlockData(event);
    const metadataToSave = JSON.parse(actions[0].data) as MotionSensor[];
    expect(metadataToSave.length).toBe(3);
    metadataToSave.forEach((data) => {
      expect(data.cm).toBe(2);
    });

    expect(actions[0].type).toEqual(
      ActionType.SETUP_SENSOR_BLOCK_SAVE_DEBUG_DATA
    );
    expect(actions[0].blockId).toEqual(sensorBlock.id);
  });
});
