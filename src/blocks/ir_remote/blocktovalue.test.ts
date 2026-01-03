import { describe, it, beforeEach, afterEach, expect } from "vitest";

import "../../core/blockly/blocks";
import type { Workspace, BlockSvg } from "blockly";
import {
  createArduinoAndWorkSpace,
  createSetVariableBlockWithValue,
  createTestEvent,
} from "../../tests/tests.helper";
import { VariableTypes } from "../../core/blockly/dto/variable.type";
import { connectToArduinoBlock } from "../../core/blockly/helpers/block.helper";
import { eventToFrameFactory } from "../../core/frames/event-to-frame.factory";
import _ from "lodash";
import { saveSensorSetupBlockData } from "../../core/blockly/actions/saveSensorSetupBlockData";
import { updater } from "../../core/blockly/updater";
import { findComponent } from "../../core/frames/transformer/frame-transformer.helpers";
import {
  ArduinoComponentType,
  ArduinoFrame,
} from "../../core/frames/arduino.frame";
import type { IRRemoteState } from "./state";
describe("button state factories", () => {
  let workspace: Workspace;

  afterEach(() => {
    workspace.dispose();
  });

  beforeEach(() => {
    [workspace] = createArduinoAndWorkSpace();
  });

  it("should be able generate state for ir remote read setup block", () => {
    const irRemoteSetup = workspace.newBlock("ir_remote_setup") as BlockSvg;
    setSetupBlock(1, true, "70", irRemoteSetup);
    setSetupBlock(2, false, "", irRemoteSetup);
    setSetupBlock(3, true, "71", irRemoteSetup);
    const hasCodeBlock = workspace.newBlock("ir_remote_has_code_receive");
    const getCodeBlock = workspace.newBlock("ir_remote_get_code");
    const varHasCodeBlock = createSetVariableBlockWithValue(
      workspace,
      "has_code",
      VariableTypes.BOOLEAN,
      true
    );

    varHasCodeBlock.getInput("VALUE").connection.targetBlock().dispose(true);
    varHasCodeBlock
      .getInput("VALUE")
      .connection.connect(hasCodeBlock.outputConnection);

    const varCodeBlock = createSetVariableBlockWithValue(
      workspace,
      "code",
      VariableTypes.NUMBER,
      true
    );

    varCodeBlock.getInput("VALUE").connection.targetBlock().dispose(true);
    varCodeBlock
      .getInput("VALUE")
      .connection.connect(getCodeBlock.outputConnection);

    connectToArduinoBlock(varHasCodeBlock);
    varHasCodeBlock.nextConnection.connect(varCodeBlock.previousConnection);

    const event = createTestEvent(varCodeBlock.id);

    const [setup, state1, state2, state3, state4, state5, state6] =
      eventToFrameFactory(event).frames;

    expect(_.keys(state1.variables).length).toBe(1);
    expect(state1.variables["has_code"].value).toBeTruthy();
    verifyComponent(state1, 70, true);

    verifyVariables(state2, 70, true);
    verifyComponent(state2, 70, true);

    verifyVariables(state3, 70, false);
    verifyComponent(state3, 0, false);

    verifyVariables(state4, 0, false);
    verifyComponent(state4, 0, false);

    verifyVariables(state5, 0, true);
    verifyComponent(state5, 71, true);

    verifyVariables(state6, 71, true);
    verifyComponent(state6, 71, true);
  });
});

const verifyVariables = (
  state: ArduinoFrame,
  code: number,
  hasCode: boolean
) => {
  expect(state.variables["has_code"].value).toBe(hasCode);
  expect(state.variables["code"].value).toBe(code);
};

const verifyComponent = (
  state: ArduinoFrame,
  code: number,
  hasCode: boolean
) => {
  const irRemoteState = findComponent<IRRemoteState>(
    state,
    ArduinoComponentType.IR_REMOTE
  );
  expect(irRemoteState.code).toBe(code);
  expect(irRemoteState.hasCode).toBe(hasCode);
};

const setSetupBlock = (
  loopNumber: number,
  scannedCode: boolean,
  code: string,
  setupBlock: BlockSvg
) => {
  setupBlock.setFieldValue(loopNumber.toString(), "LOOP");
  setupBlock.setFieldValue(scannedCode ? "TRUE" : "FALSE", "scanned_new_code");
  setupBlock.setFieldValue(code, "code");

  saveSensorSetupBlockData(createTestEvent(setupBlock.id)).forEach(updater);
};
