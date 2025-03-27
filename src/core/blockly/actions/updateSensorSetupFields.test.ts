import { describe, it, beforeEach, afterEach, expect } from "vitest";

import "../blocks";
import Blockly from "blockly";
import { getAllBlocks } from "../helpers/block.helper";
import _ from "lodash";
import type { BlockEvent } from "../dto/event.type";
import { transformBlock } from "../transformers/block.transformer";
import { updateSensorSetupFields } from "./updateSensorSetupFields";
import { UpdateSetupSensorBlockFields, ActionType } from "./actions";
import { getAllVariables } from "../helpers/variable.helper";
import { transformVariable } from "../transformers/variables.transformer";
import {
  createArduinoAndWorkSpace,
  createTestEvent,
} from "../../../tests/tests.helper";
import { MicroControllerType } from "../../microcontroller/microcontroller";

describe("updateSensorSetup", () => {
  let workspace;
  let arduinoBlock;

  beforeEach(() => {
    [workspace, arduinoBlock] = createArduinoAndWorkSpace();
  });

  afterEach(() => {
    workspace.dispose();
  });

  it("should return an event that is not change event", () => {
    // NO Sensor blocks
    const event = createTestEvent(arduinoBlock.id, Blockly.Events.BLOCK_DELETE);
    expect(updateSensorSetupFields(event)).toEqual([]);
  });

  it("should return nothing for a non loop field change event ", () => {
    workspace.newBlock("ultra_sonic_sensor_setup");
    const numBlock = workspace.newBlock("math_number");

    const numValueChangingEvent: BlockEvent = {
      type: Blockly.Events.BLOCK_CHANGE,
      blocks: getAllBlocks().map(transformBlock),
      variables: getAllVariables().map(transformVariable),
      blockId: numBlock.id,
      newValue: "3",
      oldValue: "2",
      fieldType: "field",
      fieldName: "NUM",
      microController: MicroControllerType.ARDUINO_UNO,
    };
    expect(updateSensorSetupFields(numValueChangingEvent)).toEqual([]);
  });

  it("should return nothing if sensor block has no json data stored in it.", () => {
    const sensorBlock = workspace.newBlock("ultra_sonic_sensor_setup");
    workspace.newBlock("math_number");

    const sensorBlockChangeEvent: BlockEvent = {
      type: Blockly.Events.BLOCK_CHANGE,
      blocks: getAllBlocks().map(transformBlock),
      blockId: sensorBlock.id,
      newValue: "3",
      oldValue: "2",
      fieldType: "field",
      fieldName: "LOOP",
      variables: getAllVariables().map(transformVariable),
      microController: MicroControllerType.ARDUINO_UNO,
    };
    expect(_.isEmpty(sensorBlock.data)).toBeTruthy();
    expect(updateSensorSetupFields(sensorBlockChangeEvent)).toEqual([]);
  });

  it("should update block with saved data based on the loop change", () => {
    const sensorBlock = workspace.newBlock("rfid_setup");
    workspace.newBlock("math_number");
    // scanned_card, card_number, tag
    const jsonData = JSON.stringify([
      {
        scanned_card: true,
        card_number: "333",
        tag: "tag_333",
        loop: 1,
      },
      {
        scanned_card: true,
        card_number: "111",
        tag: "tag_111",
        loop: 2,
      },
      {
        scanned_card: true,
        card_number: "222",
        tag: "tag_222",
        loop: 3,
      },
    ]);
    sensorBlock.data = jsonData;
    const sensorBlockChangeEvent: BlockEvent = {
      type: Blockly.Events.BLOCK_CHANGE,
      blocks: getAllBlocks().map(transformBlock),
      blockId: sensorBlock.id,
      newValue: "3",
      oldValue: "2",
      fieldType: "field",
      fieldName: "LOOP",
      variables: getAllVariables().map(transformVariable),
      microController: MicroControllerType.ARDUINO_UNO,
    };

    const expectedAction: UpdateSetupSensorBlockFields = {
      blockId: sensorBlock.id,
      fields: [
        {
          name: "scanned_card",
          value: true,
        },
        {
          name: "card_number",
          value: "222",
        },
        {
          name: "tag",
          value: "tag_222",
        },
      ],
      type: ActionType.SETUP_SENSOR_BLOCK_FIELD_UPDATE,
    };

    expect(updateSensorSetupFields(sensorBlockChangeEvent)).toEqual([
      expectedAction,
    ]);
  });
});
