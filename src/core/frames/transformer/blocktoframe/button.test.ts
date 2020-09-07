import "jest";
import "../../../blockly/blocks";
import Blockly, { Workspace, BlockSvg } from "blockly";
import { getAllBlocks } from "../../../blockly/helpers/block.helper";
import _ from "lodash";
import { BlockEvent } from "../../../blockly/dto/event.type";
import { transformBlock } from "../../../blockly/transformers/block.transformer";
import { getAllVariables } from "../../../blockly/helpers/variable.helper";
import { transformVariable } from "../../../blockly/transformers/variables.transformer";
import { saveSensorSetupBlockData } from "../../../blockly/actions/factories/saveSensorSetupBlockData";
import { updater } from "../../../blockly/updater";
import {
  createArduinoAndWorkSpace,
  createTestEvent,
} from "../../../../tests/tests.helper";
import { ButtonState } from "../../arduino-components.state";
import { eventToFrameFactory } from "../../event-to-frame.factory";
import { ArduinoFrame, ArduinoComponentType } from "../../arduino.frame";
import { ARDUINO_UNO_PINS } from "../../../microcontroller/selectBoard";
import { MicroControllerType } from "../../../microcontroller/microcontroller";

describe("button state factories", () => {
  let workspace: Workspace;
  let buttonSetup;

  afterEach(() => {
    workspace.dispose();
  });

  beforeEach(() => {
    [workspace] = createArduinoAndWorkSpace();
    buttonSetup = workspace.newBlock("button_setup") as BlockSvg;
    buttonSetup.setFieldValue("3", "PIN");
    buttonSetup.setFieldValue(true, "is_pressed");

    const event = createTestEvent(buttonSetup.id);
    saveSensorSetupBlockData(event).forEach(updater);
  });

  test("should be able generate state for button setup block", () => {
    const event = createTestEvent(buttonSetup.id);

    const buttonState: ButtonState = {
      isPressed: true,
      pins: [ARDUINO_UNO_PINS.PIN_3],
      type: ArduinoComponentType.BUTTON,
    };

    const state: ArduinoFrame = {
      blockId: buttonSetup.id,
      blockName: "button_setup",
      timeLine: { function: "pre-setup", iteration: 0 },
      explanation: "button 3 is being setup.",
      components: [buttonState],
      variables: {},
      txLedOn: false,
      builtInLedOn: false,
      sendMessage: "", // message arduino is sending
      delay: 0, // Number of milliseconds to delay
      powerLedOn: true,
    };

    expect(eventToFrameFactory(event).frames).toEqual([state]);
  });
});
