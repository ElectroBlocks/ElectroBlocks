import "jest";
import "../../core/blockly/blocks";
import type { Workspace, BlockSvg } from "blockly";
import {
  createArduinoAndWorkSpace,
  createSetVariableBlockWithValue,
  createTestEvent,
} from "../../tests/tests.helper";
import {
  connectToArduinoBlock,
  createBlock,
} from "../../core/blockly/helpers/block.helper";
import { VariableTypes } from "../../core/blockly/dto/variable.type";
import { eventToFrameFactory } from "../../core/frames/event-to-frame.factory";
import { ArduinoFrame } from "../../core/frames/arduino.frame";
import { DigitilDisplayState } from "./state";
import { ARDUINO_PINS } from "../../core/microcontroller/selectBoard";

describe("factories debug state", () => {
  let workspace: Workspace;
  let arduinoBlock: BlockSvg;
  let setupBlock: BlockSvg;

  afterEach(() => {
    workspace.dispose();
  });

  beforeEach(() => {
    [workspace, arduinoBlock] = createArduinoAndWorkSpace();
    setupBlock = workspace.newBlock("digital_display_setup") as BlockSvg;
    setupBlock.setFieldValue("CLK_PIN", ARDUINO_PINS.PIN_11);
    setupBlock.setFieldValue("DIO_PIN", ARDUINO_PINS.PIN_12);
  });

  test("should be able to set the text on display and dots", () => {
    function createDotBlock(top: boolean, bottom: boolean) {
      const block = workspace.newBlock("digital_display_set_dots");
      block.setFieldValue(top ? "TRUE" : "FALSE", "TOP_DOT");
      block.setFieldValue(bottom ? "TRUE" : "FALSE", "BOTTOM_DOT");
      connectToArduinoBlock(block as BlockSvg);
    }

    function verifyDotState(
      frame: ArduinoFrame,
      top: boolean,
      bottom: boolean
    ) {
      expect(frame.explanation).toBe(
        `Digital Display top dot ${top ? "on" : "off"} and bottom dot ${
          bottom ? "on" : "off"
        }.`
      );

      const state = frame.components[0] as DigitilDisplayState;

      expect(state.bottomDotOn).toBe(bottom);
      expect(state.topDotOn).toBe(top);
      expect(state.chars).toBe("");
      expect(state.clkPin).toBe(ARDUINO_PINS.PIN_11);
      expect(state.dioPin).toBe(ARDUINO_PINS.PIN_12);
    }
    createDotBlock(false, false);
    createDotBlock(true, true);
    createDotBlock(false, true);
    createDotBlock(true, false);

    const event = createTestEvent(setupBlock.id);
    const frames = eventToFrameFactory(event).frames;

    expect(frames.length).toBe(5);

    const [frame1, frame2, frame3, frame4, frame5] = frames;

    expect(frame1.explanation).toBe("Setting  up Digital Display");
    verifyDotState(frame1, false, false);
    verifyDotState(frame2, true, false);
    verifyDotState(frame3, false, true);
    verifyDotState(frame4, true, true);
    verifyDotState(frame5, false, false);
  });
});
