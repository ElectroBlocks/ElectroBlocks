import "jest";
import "../../../blockly/blocks";
import Blockly, { Workspace, BlockSvg, WorkspaceSvg, Blocks } from "blockly";
import {
  getAllBlocks,
  getBlockById,
} from "../../../blockly/helpers/block.helper";
import _ from "lodash";
import { BlockEvent } from "../../../blockly/dto/event.type";
import { transformBlock } from "../../../blockly/transformers/block.transformer";
import { getAllVariables } from "../../../blockly/helpers/variable.helper";
import { transformVariable } from "../../../blockly/transformers/variables.transformer";
import { eventToFrameFactory } from "../../event-to-frame.factory";
import { ARDUINO_PINS } from "../../../microcontroller/selectBoard";
import { saveSensorSetupBlockData } from "../../../blockly/actions/factories/saveSensorSetupBlockData";
import { updater } from "../../../blockly/updater";
import { ArduinoFrame, ArduinoComponentType } from "../../arduino.frame";
import { RfidState } from "../../arduino-components.state";
import {
  createArduinoAndWorkSpace,
  createTestEvent,
} from "../../../../tests/tests.helper";
import { MicroControllerType } from "../../../microcontroller/microcontroller";

describe("rfid state factories", () => {
  let workspace: Workspace;
  let rfidBlock;

  afterEach(() => {
    workspace.dispose();
  });

  beforeEach(() => {
    [workspace] = createArduinoAndWorkSpace();

    rfidBlock = workspace.newBlock("rfid_setup");
    rfidBlock.setFieldValue(ARDUINO_PINS.PIN_6, "TX");

    rfidBlock.setFieldValue("TRUE", "scanned_card");
    rfidBlock.setFieldValue("card_num", "card_number");
    rfidBlock.setFieldValue("tag", "tag");

    const event = createTestEvent(rfidBlock.id);
    saveSensorSetupBlockData(event).forEach(updater);
  });

  test("should be able generate state for rfid setup block", () => {
    const event = createTestEvent(rfidBlock.id);

    const rfidComponent: RfidState = {
      pins: [ARDUINO_PINS.PIN_6],
      txPin: ARDUINO_PINS.PIN_6,
      scannedCard: true,
      cardNumber: "card_num",
      tag: "tag",
      type: ArduinoComponentType.RFID,
    };

    const rfidSetupState: ArduinoFrame = {
      blockId: rfidBlock.id,
      blockName: "rfid_setup",
      timeLine: { function: "pre-setup", iteration: 0 },
      explanation: "Setting up RFID.",
      components: [rfidComponent],
      variables: {},
      txLedOn: false,
      builtInLedOn: false,
      sendMessage: "", // message arduino is sending
      delay: 0, // Number of milliseconds to delay
      powerLedOn: true,
    };

    expect(eventToFrameFactory(event).frames).toEqual([rfidSetupState]);
  });
});
