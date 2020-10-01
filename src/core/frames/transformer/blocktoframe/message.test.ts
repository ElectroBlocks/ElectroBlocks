import "jest";
import "../../../blockly/blocks";
import Blockly, { Workspace, BlockSvg, WorkspaceSvg, Blocks } from "blockly";
import { connectToArduinoBlock } from "../../../blockly/helpers/block.helper";
import _ from "lodash";
import { eventToFrameFactory } from "../../event-to-frame.factory";
import { saveSensorSetupBlockData } from "../../../blockly/actions/saveSensorSetupBlockData";
import { updater } from "../../../blockly/updater";
import { ArduinoFrame, ArduinoComponentType } from "../../arduino.frame";
import { ArduinoReceiveMessageState } from "../../arduino-components.state";
import {
  createArduinoAndWorkSpace,
  createValueBlock,
  createTestEvent,
} from "../../../../tests/tests.helper";
import { VariableTypes } from "../../../blockly/dto/variable.type";

describe("arduino message state factories", () => {
  let workspace: Workspace;
  let messageSetup;
  let arduinoBlock: BlockSvg;

  afterEach(() => {
    workspace.dispose();
  });

  beforeEach(() => {
    [workspace, arduinoBlock] = createArduinoAndWorkSpace();
    arduinoBlock.setFieldValue("1", "LOOP_TIMES");
    messageSetup = workspace.newBlock("message_setup");

    messageSetup.setFieldValue("TRUE", "receiving_message");
    messageSetup.setFieldValue("hello world", "message");

    const event = createTestEvent(messageSetup.id);
    saveSensorSetupBlockData(event).forEach(updater);
  });

  test("should be able send a message", () => {
    const sendMessageBlock = workspace.newBlock(
      "arduino_send_message"
    ) as BlockSvg;
    const textBlock = createValueBlock(
      workspace,
      VariableTypes.STRING,
      "Hello World!"
    );
    sendMessageBlock
      .getInput("MESSAGE")
      .connection.connect(textBlock.outputConnection);

    connectToArduinoBlock(sendMessageBlock);

    const event = createTestEvent(messageSetup.id);

    const [state1, state2] = eventToFrameFactory(event).frames;

    expect(state2.blockId).toBe(sendMessageBlock.id);
    expect(state2.explanation).toBe('Arduino sending message: "Hello World!".');
    expect(state2.sendMessage).toBe("Hello World!");
    expect(state2.txLedOn).toBeTruthy();
    expect(state2.builtInLedOn).toBeFalsy();
  });

  test("should be able generate state for message setup block", () => {
    const event = createTestEvent(messageSetup.id);

    const message: ArduinoReceiveMessageState = {
      pins: [],
      hasMessage: true,
      message: "hello world",
      type: ArduinoComponentType.MESSAGE,
    };

    const state: ArduinoFrame = {
      blockId: messageSetup.id,
      blockName: "message_setup",
      timeLine: { function: "pre-setup", iteration: 0 },
      explanation: "Setting up Arduino messages.",
      components: [message],
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
