import "jest";
import "../../../blockly/blocks";
import Blockly, { Workspace, BlockSvg, WorkspaceSvg, Blocks } from "blockly";
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
import { IRRemoteState } from "../../arduino-components.state";
import { eventToFrameFactory } from "../../event-to-frame.factory";
import { ArduinoFrame, ArduinoComponentType } from "../../arduino.frame";
import { ARDUINO_PINS } from "../../../microcontroller/selectBoard";
import { MicroControllerType } from "../../../microcontroller/microcontroller";

describe("button state factories", () => {
  let workspace: Workspace;
  let irRemoteSetup;

  afterEach(() => {
    workspace.dispose();
  });

  beforeEach(() => {
    [workspace] = createArduinoAndWorkSpace();
    irRemoteSetup = workspace.newBlock("ir_remote_setup") as BlockSvg;
    irRemoteSetup.setFieldValue(ARDUINO_PINS.PIN_A4, "PIN");
    irRemoteSetup.setFieldValue("TRUE", "scanned_new_code");
    irRemoteSetup.setFieldValue("32343", "code");

    const event = createTestEvent(irRemoteSetup.id);
    saveSensorSetupBlockData(event).forEach(updater);
  });

  it("should be able generate state for ir remote read setup block", () => {
    const event = createTestEvent(irRemoteSetup.id);

    const irRemote: IRRemoteState = {
      code: "32343",
      pins: [ARDUINO_PINS.PIN_A4],
      hasCode: true,
      analogPin: ARDUINO_PINS.PIN_A4,
      type: ArduinoComponentType.IR_REMOTE,
    };

    const state: ArduinoFrame = {
      blockId: irRemoteSetup.id,
      blockName: "ir_remote_setup",
      timeLine: { function: "pre-setup", iteration: 0 },
      explanation: "Setting up ir remote.",
      components: [irRemote],
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
