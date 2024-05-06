import "../../core/blockly/blocks";
import "../../tests/fake-block";

import type { Workspace, BlockSvg } from "blockly";
import { connectToArduinoBlock } from "../../core/blockly/helpers/block.helper";
import _ from "lodash";
import { describe, it, beforeEach, afterEach, expect } from "vitest";
import { eventToFrameFactory } from "../../core/frames/event-to-frame.factory";
import { ARDUINO_PINS } from "../../core/microcontroller/selectBoard";
import {
  ArduinoFrame,
  ArduinoComponentType,
} from "../../core/frames/arduino.frame";
import type { LedColorState } from "./state";
import {
  createArduinoAndWorkSpace,
  createValueBlock,
  createTestEvent,
} from "../../tests/tests.helper";
import { VariableTypes } from "../../core/blockly/dto/variable.type";

describe("rgb led frame", () => {
  let workspace: Workspace;
  let ledColorSetup: BlockSvg;

  afterEach(() => {
    workspace.dispose();
  });

  beforeEach(() => {
    [workspace] = createArduinoAndWorkSpace();
    ledColorSetup = workspace.newBlock("rgb_led_setup") as BlockSvg;
    ledColorSetup.setFieldValue("11", "PIN_RED");
    ledColorSetup.setFieldValue("10", "PIN_GREEN");
    ledColorSetup.setFieldValue("9", "PIN_BLUE");
    ledColorSetup.setFieldValue("BUILT_IN", "PICTURE_TYPE");
  });

  it("should be able generate state for led color setup block", () => {
    const event = createTestEvent(ledColorSetup.id);

    const ledColorState: LedColorState = {
      pins: [ARDUINO_PINS.PIN_10, ARDUINO_PINS.PIN_11, ARDUINO_PINS.PIN_9],
      redPin: ARDUINO_PINS.PIN_11,
      greenPin: ARDUINO_PINS.PIN_10,
      bluePin: ARDUINO_PINS.PIN_9,
      pictureType: "BUILT_IN",
      color: { green: 0, red: 0, blue: 0 },
      type: ArduinoComponentType.LED_COLOR,
    };

    const state: ArduinoFrame = {
      blockId: ledColorSetup.id,
      blockName: "rgb_led_setup",
      timeLine: { function: "pre-setup", iteration: 0 },
      explanation: "Setting up color led.",
      components: [ledColorState],
      variables: {},
      txLedOn: false,
      builtInLedOn: false,
      sendMessage: "", // message arduino is sending
      delay: 0, // Number of milliseconds to delay
      powerLedOn: true,
      frameNumber: 1,
    };

    expect(eventToFrameFactory(event).frames).toEqual([state]);
  });

  it("should be able to change color the led", () => {
    ledColorSetup.setFieldValue("BREADBOARD", "PICTURE_TYPE");
    const color1 = createValueBlock(workspace, VariableTypes.COLOUR, {
      red: 200,
      blue: 0,
      green: 200,
    });

    const color2 = createValueBlock(workspace, VariableTypes.COLOUR, {
      red: 200,
      blue: 100,
      green: 0,
    });

    const setColorBlock1 = workspace.newBlock("set_color_led") as BlockSvg;
    const setColorBlock2 = workspace.newBlock("set_color_led");
    setColorBlock1
      .getInput("COLOUR")
      .connection.connect(color1.outputConnection);
    setColorBlock2
      .getInput("COLOUR")
      .connection.connect(color2.outputConnection);

    connectToArduinoBlock(setColorBlock1);
    setColorBlock1.nextConnection.connect(setColorBlock2.previousConnection);

    const event = createTestEvent(ledColorSetup.id);

    const [state1, state2, state3] = eventToFrameFactory(event).frames;

    expect(state2.explanation).toBe(
      "Setting led color to (red=200,green=200,blue=0)."
    );

    expect(state2.components.length).toBe(1);
    const [component2] = state2.components as LedColorState[];
    expect(component2.pictureType).toBe("BREADBOARD");
    expect(component2.color).toEqual({ red: 200, green: 200, blue: 0 });

    expect(state3.explanation).toBe(
      "Setting led color to (red=200,green=0,blue=100)."
    );

    expect(state3.components.length).toBe(1);
    const [component3] = state3.components as LedColorState[];
    expect(component3.pictureType).toBe("BREADBOARD");
    expect(component3.color).toEqual({ red: 200, green: 0, blue: 100 });
  });
});
