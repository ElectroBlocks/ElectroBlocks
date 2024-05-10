import { describe, it, beforeEach, afterEach, expect } from "vitest";

import "../../tests/fake-block";
import "../../core/blockly/blocks";

import { Workspace, BlockSvg, Block } from "blockly";
import { connectToArduinoBlock } from "../../core/blockly/helpers/block.helper";
import _ from "lodash";
import { eventToFrameFactory } from "../../core/frames/event-to-frame.factory";
import { ARDUINO_PINS } from "../../core/microcontroller/selectBoard";
import {
  ArduinoFrame,
  ArduinoComponentType,
} from "../../core/frames/arduino.frame";
import {
  createArduinoAndWorkSpace,
  createValueBlock,
  createTestEvent,
} from "../../tests/tests.helper";
import { VariableTypes } from "../../core/blockly/dto/variable.type";
import type { NeoPixelState } from "./state";

describe("neo pixle state factories", () => {
  let workspace: Workspace;
  let neoPixelSetup: BlockSvg;

  afterEach(() => {
    workspace.dispose();
  });

  beforeEach(() => {
    [workspace] = createArduinoAndWorkSpace();
    neoPixelSetup = workspace.newBlock("neo_pixel_setup") as BlockSvg;
    neoPixelSetup.setFieldValue("60", "NUMBER_LEDS");
    neoPixelSetup.setFieldValue(ARDUINO_PINS.PIN_6, "PIN");
  });

  it("should be able generate state for neo pixel setup block", () => {
    const event = createTestEvent(neoPixelSetup.id);

    const ledLightStrip: NeoPixelState = {
      pins: [ARDUINO_PINS.PIN_6],
      numberOfLeds: 60,
      type: ArduinoComponentType.NEO_PIXEL_STRIP,
      neoPixels: _.range(0, 60).map((i) => {
        return {
          position: i,
          color: { red: 0, green: 0, blue: 0 },
        };
      }),
    };

    const state: ArduinoFrame = {
      blockId: neoPixelSetup.id,
      blockName: "neo_pixel_setup",
      timeLine: { function: "pre-setup", iteration: 0 },
      explanation: "Setting up led light strip.",
      components: [ledLightStrip],
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

  it("should be able to set all the colors of an led light strip.", () => {
    const setNeoPixel1Block = workspace.newBlock(
      "neo_pixel_set_color"
    ) as BlockSvg;
    const setNeoPixel2Block = workspace.newBlock("neo_pixel_set_color");
    const position1Block = createValueBlock(workspace, VariableTypes.NUMBER, 1);
    const position2Block = createValueBlock(
      workspace,
      VariableTypes.NUMBER,
      31
    );
    const color1Block = createValueBlock(workspace, VariableTypes.COLOUR, {
      red: 0,
      green: 0,
      blue: 100,
    });
    const color2Block = createValueBlock(workspace, VariableTypes.COLOUR, {
      red: 100,
      green: 0,
      blue: 100,
    });

    setNeoPixel1Block
      .getInput("COLOR")
      .connection.connect(color1Block.outputConnection);
    setNeoPixel1Block
      .getInput("POSITION")
      .connection.connect(position1Block.outputConnection);
    setNeoPixel2Block
      .getInput("COLOR")
      .connection.connect(color2Block.outputConnection);
    setNeoPixel2Block
      .getInput("POSITION")
      .connection.connect(position2Block.outputConnection);

    connectToArduinoBlock(setNeoPixel1Block);
    setNeoPixel1Block.nextConnection.connect(
      setNeoPixel2Block.previousConnection
    );

    const event = createTestEvent(setNeoPixel1Block.id);

    const [state1, state2, state3] = eventToFrameFactory(event).frames;

    expect(state2.explanation).toBe(
      "Setting LED 1 on light strip to color (red=0,green=0,blue=100)"
    );
    expect(state2.components.length).toBe(1);
    const [component1] = state2.components as NeoPixelState[];
    component1.neoPixels.forEach((pixel) => {
      if (pixel.position === 0) {
        expect(pixel.color).toEqual({
          red: 0,
          green: 0,
          blue: 100,
        });
        return;
      }
      expect(pixel.color).toEqual({
        red: 0,
        green: 0,
        blue: 0,
      });
    });
    expect(state3.blockId).toBe(setNeoPixel2Block.id);
    // expect(state3.explanation).toBe(
    //   'Setting LED 31 on light strip to color (red=0,green=0,blue=100)'
    // );
    expect(state3.components.length).toBe(1);
    const [componentv2] = state3.components as NeoPixelState[];
    componentv2.neoPixels.forEach((pixel) => {
      if (pixel.position === 0) {
        expect(pixel.color).toEqual({
          red: 0,
          green: 0,
          blue: 100,
        });
        return;
      }

      if (pixel.position === 30) {
        expect(pixel.color).toEqual({
          red: 100,
          green: 0,
          blue: 100,
        });
        return;
      }
      expect(pixel.color).toEqual({
        red: 0,
        green: 0,
        blue: 0,
      });
    });
  });
});
