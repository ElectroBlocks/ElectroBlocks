import { describe, it, beforeEach, afterEach, expect } from "vitest";

import "../../core/blockly/blocks";
import type { Workspace, BlockSvg, Block } from "blockly";
import { connectToArduinoBlock } from "../../core/blockly/helpers/block.helper";
import _ from "lodash";
import { eventToFrameFactory } from "../../core/frames/event-to-frame.factory";
import { saveSensorSetupBlockData } from "../../core/blockly/actions/saveSensorSetupBlockData";
import { updater } from "../../core/blockly/updater";
import {
  ArduinoFrame,
  ArduinoComponentType,
} from "../../core/frames/arduino.frame";
import {
  createArduinoAndWorkSpace,
  createSetVariableBlockWithValue,
  createTestEvent,
} from "../../tests/tests.helper";
import { VariableTypes } from "../../core/blockly/dto/variable.type";
import {
  getDefaultValue,
  findComponent,
} from "../../core/frames/transformer/frame-transformer.helpers";
import type { RfidState } from "./state";

describe("rfid value factories", () => {
  let workspace: Workspace;

  afterEach(() => {
    workspace.dispose();
  });

  beforeEach(() => {
    [workspace] = createArduinoAndWorkSpace();
  });

  it("should be able generate state for rfid setup block", () => {
    const setupBlock = workspace.newBlock("rfid_setup") as BlockSvg;

    const rfidHasScanCardBlock = workspace.newBlock("rfid_scan");
    const rfidTagBlock = workspace.newBlock("rfid_tag");

    setSetupBlock(1, true, "tag_1", setupBlock);
    setSetupBlock(2, false, "", setupBlock);
    setSetupBlock(3, true, "tag_3", setupBlock);

    const hasCardVarBlock = createVariableBlock(
      "has_card",
      VariableTypes.BOOLEAN,
      rfidHasScanCardBlock,
      workspace
    );

    const tagNumberVarBlock = createVariableBlock(
      "tag_number",
      VariableTypes.STRING,
      rfidTagBlock,
      workspace
    );

    connectToArduinoBlock(hasCardVarBlock);
    hasCardVarBlock.nextConnection.connect(
      tagNumberVarBlock.previousConnection
    );

    const [setup, state1, state2, state3, state4, state5, state6] =
      eventToFrameFactory(createTestEvent(setupBlock.id)).frames;
    console.log(state1.blockName);
    verifyComponent(state1, true, "tag_1");
    verifyComponent(state2, true, "tag_1");
    verifyComponent(state3, false, "");
    verifyComponent(state4, false, "");
    verifyComponent(state5, true, "tag_3");
    verifyComponent(state6, true, "tag_3");

    verifyVariables(state1, true, undefined);
    verifyVariables(state2, true, "tag_1");

    verifyVariables(state3, false, "tag_1");
    verifyVariables(state4, false, "");

    verifyVariables(state5, true, "");
    verifyVariables(state6, true, "tag_3");
  });
});

const verifyComponent = (
  state: ArduinoFrame,
  hasCard: boolean,
  tag: string
) => {
  const rfidState = findComponent<RfidState>(state, ArduinoComponentType.RFID);

  expect(rfidState.scannedCard).toBe(hasCard);
  expect(rfidState.tag).toBe(tag);
};

const verifyVariables = (
  state: ArduinoFrame,
  hasCard: boolean | undefined,
  tag: string | undefined
) => {
  if (hasCard !== undefined) {
    expect(state.variables["has_card"].value).toBe(hasCard);
  }

  if (tag !== undefined) {
    expect(state.variables["tag_number"].value).toBe(tag);
  }
};

const createVariableBlock = (
  variableName: string,
  type: VariableTypes,
  sensorBlock: Block,
  workspace: Workspace
) => {
  const varBlock = createSetVariableBlockWithValue(
    workspace,
    variableName,
    type,
    getDefaultValue(type)
  );
  varBlock.getInput("VALUE").connection.targetBlock().dispose(true);

  varBlock.getInput("VALUE").connection.connect(sensorBlock.outputConnection);

  return varBlock;
};

const setSetupBlock = (
  loopNumber: number,
  scannedCard: boolean,
  tag: string,
  setupBlock: BlockSvg
) => {
  setupBlock.setFieldValue(loopNumber.toString(), "LOOP");
  setupBlock.setFieldValue(scannedCard ? "TRUE" : "FALSE", "scanned_card");
  setupBlock.setFieldValue(tag, "tag");

  saveSensorSetupBlockData(createTestEvent(setupBlock.id)).forEach(updater);
};
