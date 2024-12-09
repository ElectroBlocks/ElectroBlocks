import { describe, it, beforeEach, afterEach, expect } from "vitest";

import "../blocks";
import {
  createArduinoAndWorkSpace,
  createTestEvent,
} from "../../../tests/tests.helper";
import { ActionType } from "./actions";
import { updateWhichComponent } from "./updateWhichComponent";
import { ArduinoComponentType } from "../../frames/arduino.frame";

describe("changeNumberOfComponentsInSetupBlock", () => {
  let workspace;
  let arduinoBlock;

  beforeEach(() => {
    [workspace, arduinoBlock] = createArduinoAndWorkSpace();
  });

  afterEach(() => {
    workspace.dispose();
  });

  it("should hide/show based on the number of motors the user set.", () => {
    // Hide the motors
    const motorSetupBlock = workspace.newBlock("motor_setup");
    motorSetupBlock.setFieldValue("1", "NUMBER_OF_COMPONENTS");
    const event = createTestEvent(motorSetupBlock.id);
    expect(
      updateWhichComponent(
        "motor_setup",
        ["move_motor", "stop_motor", "motor_setup"],
        ArduinoComponentType.MOTOR
      )(event)
    ).toEqual([
      {
        blockId: motorSetupBlock.id,
        componentType: ArduinoComponentType.MOTOR,
        numberOfComponents: 1,
        type: ActionType.UPDATE_MULTIPLE_SETUP_BLOCK,
      },
    ]);

    // Show the motors
    motorSetupBlock.setFieldValue("2", "NUMBER_OF_COMPONENTS");
    const event2 = createTestEvent(motorSetupBlock.id);
    expect(
      updateWhichComponent(
        "motor_setup",
        ["move_motor", "stop_motor", "motor_setup"],
        ArduinoComponentType.MOTOR
      )(event2)
    ).toEqual([
      {
        blockId: motorSetupBlock.id,
        componentType: ArduinoComponentType.MOTOR,
        numberOfComponents: 2,
        type: ActionType.UPDATE_MULTIPLE_SETUP_BLOCK,
      },
    ]);
  });
});
