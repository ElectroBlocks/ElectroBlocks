import { describe, it, beforeEach, afterEach, expect } from "vitest";

import "../../blocks";
import type { Workspace } from "blockly";
import _ from "lodash";
import { ActionType } from "../actions";
import { ARDUINO_PINS } from "../../../microcontroller/selectBoard";
import { disableSensorReadBlocksWithWrongPins } from "./disableSensorReadBlocksWithWrongPins";
import {
  createArduinoAndWorkSpace,
  createTestEvent,
} from "../../../../tests/tests.helper";
import { MicroControllerType } from "../../../microcontroller/microcontroller";

describe("disableSensorReadBlocksWithWrongPins", () => {
  let workspace: Workspace;
  let arduinoBlock;

  beforeEach(() => {
    [workspace, arduinoBlock] = createArduinoAndWorkSpace();
  });

  afterEach(() => {
    workspace.dispose();
  });

  it("sensor read blocks that have pins select that are not selected by the setup block are disabled", () => {
    const btnSetup1 = workspace.newBlock("button_setup");
    btnSetup1.setFieldValue(ARDUINO_PINS.PIN_10, "PIN");
    const btnSetup2 = workspace.newBlock("button_setup");
    btnSetup2.setFieldValue(ARDUINO_PINS.PIN_4, "PIN");
    const btnSetup3 = workspace.newBlock("button_setup");
    btnSetup3.setFieldValue(ARDUINO_PINS.PIN_5, "PIN");

    const btnPressed1 = workspace.newBlock("is_button_pressed");
    btnPressed1.setFieldValue(ARDUINO_PINS.PIN_10, "PIN");
    const btnPressed2 = workspace.newBlock("is_button_pressed");
    btnPressed2.setFieldValue(ARDUINO_PINS.PIN_5, "PIN");

    const btnPressed4 = workspace.newBlock("is_button_pressed");
    btnPressed4.setFieldValue(ARDUINO_PINS.PIN_4, "PIN");

    // Done so that we can set the field value to 10 on one of the blocks.
    // Then change the setup block to make sure it disables the sensor read block
    btnSetup1.setFieldValue(ARDUINO_PINS.PIN_3, "PIN");

    // These blocks should not be affected because they don't have a setup block
    // Another function will disable theses blocks.
    workspace.newBlock("arduino_send_message");
    workspace.newBlock("analog_read");

    const event = createTestEvent(arduinoBlock.id);

    const actions = disableSensorReadBlocksWithWrongPins(event);

    expect(actions.length).toBe(1);

    expect(actions[0].blockId).toBe(btnPressed1.id);
    expect(actions[0].warningText).toBe(
      "Please change the pin number to match the setup block"
    );
    expect(actions[0].type).toBe(ActionType.DISABLE_BLOCK);
  });
});
