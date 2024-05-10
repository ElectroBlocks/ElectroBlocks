import { describe, it, beforeEach, afterEach, expect } from "vitest";

import "../../core/blockly/blocks";
import type { Workspace, BlockSvg } from "blockly";
import { connectToArduinoBlock } from "../../core/blockly/helpers/block.helper";
import _ from "lodash";

import {
  createArduinoAndWorkSpace,
  createSetVariableBlockWithValue,
  createTestEvent,
} from "../../tests/tests.helper";
import { VariableTypes } from "../../core/blockly/dto/variable.type";
import { saveSensorSetupBlockData } from "../../core/blockly/actions/saveSensorSetupBlockData";
import { updater } from "../../core/blockly/updater";
import { ARDUINO_PINS } from "../../core/microcontroller/selectBoard";
import { ArduinoComponentType } from "../../core/frames/arduino.frame";
import { findComponent } from "../../core/frames/transformer/frame-transformer.helpers";
import { eventToFrameFactory } from "../../core/frames/event-to-frame.factory";
import type { BluetoothState } from "./state";

describe("bluetooth state factories", () => {
  let workspace: Workspace;
  let btSetupBlock: BlockSvg;
  let arduinoBlock: BlockSvg;
  afterEach(() => {
    workspace.dispose();
  });

  beforeEach(() => {
    [workspace, arduinoBlock] = createArduinoAndWorkSpace();
    btSetupBlock = workspace.newBlock("bluetooth_setup") as BlockSvg;
    btSetupBlock.setFieldValue(ARDUINO_PINS.PIN_7, "PIN_RX");
    btSetupBlock.setFieldValue(ARDUINO_PINS.PIN_6, "PIN_TX");
  });

  it("should be able generate state for bluetooth setup block", () => {
    arduinoBlock.setFieldValue("3", "LOOP_TIMES");
    btSetupBlock.setFieldValue("TRUE", "receiving_message");
    btSetupBlock.setFieldValue("MESSAGE_1", "message");
    btSetupBlock.setFieldValue("1", "LOOP");

    saveSensorSetupBlockData(createTestEvent(btSetupBlock.id)).forEach(updater);

    btSetupBlock.setFieldValue("FALSE", "receiving_message");
    btSetupBlock.setFieldValue("", "message");
    btSetupBlock.setFieldValue("2", "LOOP");

    saveSensorSetupBlockData(createTestEvent(btSetupBlock.id)).forEach(updater);

    btSetupBlock.setFieldValue("TRUE", "receiving_message");
    btSetupBlock.setFieldValue("MESSAGE_3", "message");
    btSetupBlock.setFieldValue("3", "LOOP");

    saveSensorSetupBlockData(createTestEvent(btSetupBlock.id)).forEach(updater);

    const getBtMessageBlock = workspace.newBlock("bluetooth_get_message");
    const hasBtMessageBlock = workspace.newBlock("bluetooth_has_message");

    const setVariableTextBlock = createSetVariableBlockWithValue(
      workspace,
      "message",
      VariableTypes.STRING,
      ""
    );

    const hasMessageBoolBlock = createSetVariableBlockWithValue(
      workspace,
      "hasMessage",
      VariableTypes.BOOLEAN,
      true
    );

    setVariableTextBlock
      .getInput("VALUE")
      .connection.targetBlock()
      .dispose(true);

    hasMessageBoolBlock
      .getInput("VALUE")
      .connection.targetBlock()
      .dispose(true);

    setVariableTextBlock
      .getInput("VALUE")
      .connection.connect(getBtMessageBlock.outputConnection);

    hasMessageBoolBlock
      .getInput("VALUE")
      .connection.connect(hasBtMessageBlock.outputConnection);

    connectToArduinoBlock(setVariableTextBlock);
    connectToArduinoBlock(hasMessageBoolBlock);

    const event = createTestEvent(btSetupBlock.id);

    const states = eventToFrameFactory(event).frames;

    expect(states.length).toBe(7);
    const [state1, state2, state3, state4, state5, state6, state7] = states;

    // LOOP 1
    expect(state2.variables["hasMessage"].value).toBe(true);
    expect(_.keys(state2.variables).length).toBe(1);
    expect(
      findComponent<BluetoothState>(state2, ArduinoComponentType.BLUE_TOOTH)
        .hasMessage
    ).toBeTruthy();
    expect(
      findComponent<BluetoothState>(state2, ArduinoComponentType.BLUE_TOOTH)
        .message
    ).toBe("MESSAGE_1");

    expect(state3.variables["hasMessage"].value).toBe(true);
    expect(state3.variables["message"].value).toBe("MESSAGE_1");
    expect(_.keys(state3.variables).length).toBe(2);
    expect(
      findComponent<BluetoothState>(state3, ArduinoComponentType.BLUE_TOOTH)
        .hasMessage
    ).toBeTruthy();
    expect(
      findComponent<BluetoothState>(state3, ArduinoComponentType.BLUE_TOOTH)
        .message
    ).toBe("MESSAGE_1");

    // LOOP 2
    expect(state4.variables["hasMessage"].value).toBe(false);
    expect(state4.variables["message"].value).toBe("MESSAGE_1");
    expect(_.keys(state4.variables).length).toBe(2);
    expect(
      findComponent<BluetoothState>(state4, ArduinoComponentType.BLUE_TOOTH)
        .hasMessage
    ).toBeFalsy();
    expect(
      findComponent<BluetoothState>(state4, ArduinoComponentType.BLUE_TOOTH)
        .message
    ).toBe("");

    expect(state5.variables["hasMessage"].value).toBe(false);
    expect(state5.variables["message"].value).toBe("");
    expect(_.keys(state5.variables).length).toBe(2);
    expect(
      findComponent<BluetoothState>(state5, ArduinoComponentType.BLUE_TOOTH)
        .hasMessage
    ).toBeFalsy();
    expect(
      findComponent<BluetoothState>(state5, ArduinoComponentType.BLUE_TOOTH)
        .message
    ).toBe("");

    // LOOP 3
    expect(state6.variables["hasMessage"].value).toBe(true);
    expect(state6.variables["message"].value).toBe("");
    expect(_.keys(state6.variables).length).toBe(2);
    expect(
      findComponent<BluetoothState>(state6, ArduinoComponentType.BLUE_TOOTH)
        .hasMessage
    ).toBeTruthy();
    expect(
      findComponent<BluetoothState>(state6, ArduinoComponentType.BLUE_TOOTH)
        .message
    ).toBe("MESSAGE_3");

    expect(state7.variables["hasMessage"].value).toBe(true);
    expect(state7.variables["message"].value).toBe("MESSAGE_3");
    expect(_.keys(state7.variables).length).toBe(2);
    expect(
      findComponent<BluetoothState>(state7, ArduinoComponentType.BLUE_TOOTH)
        .hasMessage
    ).toBeTruthy();
    expect(
      findComponent<BluetoothState>(state7, ArduinoComponentType.BLUE_TOOTH)
        .message
    ).toBe("MESSAGE_3");
  });
});
