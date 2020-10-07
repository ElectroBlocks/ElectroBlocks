import "../../core/blockly/blocks";
import Blockly, { Workspace, BlockSvg, WorkspaceSvg, Blocks } from "blockly";
import {
  getAllBlocks,
  getBlockById,
} from "../../core/blockly/helpers/block.helper";
import _ from "lodash";
import { BlockEvent } from "../../core/blockly/dto/event.type";
import { transformBlock } from "../../core/blockly/transformers/block.transformer";
import { getAllVariables } from "../../core/blockly/helpers/variable.helper";
import { transformVariable } from "../../core/blockly/transformers/variables.transformer";
import { eventToFrameFactory } from "../../core/frames/event-to-frame.factory";
import { ARDUINO_PINS } from "../../core/microcontroller/selectBoard";
import { saveSensorSetupBlockData } from "../../core/blockly/actions/saveSensorSetupBlockData";
import { updater } from "../../core/blockly/updater";
import {
  ArduinoFrame,
  ArduinoComponentType,
} from "../../core/frames/arduino.frame";
import { TimeState } from "../../core/frames/arduino-components.state";
import {
  createArduinoAndWorkSpace,
  createTestEvent,
} from "../../tests/tests.helper";

describe("time state factories", () => {
  let workspace: Workspace;
  let timesetup;

  afterEach(() => {
    workspace.dispose();
  });

  beforeEach(() => {
    [workspace] = createArduinoAndWorkSpace();
    timesetup = workspace.newBlock("time_setup");

    timesetup.setFieldValue(".3", "time_in_seconds");
  });

  test("should be able generate state for time setup block", () => {
    const event = createTestEvent(timesetup.id);

    const timeState: TimeState = {
      pins: [],
      timeInSeconds: 0.3,
      type: ArduinoComponentType.TIME,
    };

    const state: ArduinoFrame = {
      blockId: timesetup.id,
      blockName: "time_setup",
      timeLine: { function: "pre-setup", iteration: 0 },
      explanation: "Setting up Arduino time.",
      components: [timeState],
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
