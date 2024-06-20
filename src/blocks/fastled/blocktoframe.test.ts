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
import type { FastLEDState } from "./state";
import { hexToRgb } from "../../core/blockly/helpers/color.helper";

describe("fastLED state factories", () => {
  let workspace: Workspace;
  let fastLEDSetup: BlockSvg;

  afterEach(() => {
    workspace.dispose();
  });

  beforeEach(() => {
    [workspace] = createArduinoAndWorkSpace();
    fastLEDSetup = workspace.newBlock("fastled_setup") as BlockSvg;
    fastLEDSetup.setFieldValue("60", "NUMBER_LEDS");
    fastLEDSetup.setFieldValue(ARDUINO_PINS.PIN_6, "PIN");
  });

  it("should be able generate state for fastled setup block", () => {
    const event = createTestEvent(fastLEDSetup.id);

    const ledLightStrip: FastLEDState = {
      pins: [ARDUINO_PINS.PIN_6],
      numberOfLeds: 60,
      type: ArduinoComponentType.FASTLED_STRIP,
      preShowLEDs: _.range(0, 60).map((i) => {
        return {
          position: i,
          color: { red: 0, green: 0, blue: 0 },
        };
      }),
      fastLEDs: _.range(0, 60).map((i) => {
        return {
          position: i,
          color: { red: 0, green: 0, blue: 0 },
        };
      }),
    };

    const state: ArduinoFrame = {
      blockId: fastLEDSetup.id,
      blockName: "fastled_setup",
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

  it("should be able to use set all color block and be able to change to showing all the colors", () => {
    const setAllColorBlock = workspace.newBlock(
      "fastled_set_all_colors"
    ) as BlockSvg;
    const showAllColors = workspace.newBlock(
      "fastled_show_all_colors"
    ) as BlockSvg;
    setAllColorBlock.setFieldValue("#FF0000", "1-1");
    setAllColorBlock.setFieldValue("#00AA00", "2-2");
    connectToArduinoBlock(showAllColors);
    connectToArduinoBlock(setAllColorBlock);
    const [_, state2, state3] = eventToFrameFactory(
      createTestEvent(setAllColorBlock.id)
    ).frames;

    expect(state2.components.length).toBe(1);
    const [component1State2] = state2.components as FastLEDState[];

    for (let i = 0; i < 60; i += 1) {
      expect(component1State2.preShowLEDs[i].color.blue).toBe(0);
      if (i == 13) {
        expect(component1State2.preShowLEDs[i].color.green).toBe(170);
      } else if (i == 0) {
        expect(component1State2.preShowLEDs[i].color.red).toBe(255);
      } else {
        expect(component1State2.preShowLEDs[i].color.green).toBe(0);
        expect(component1State2.preShowLEDs[i].color.red).toBe(0);
      }
      expect(component1State2.fastLEDs[i].color.red).toBe(0);
      expect(component1State2.fastLEDs[i].color.green).toBe(0);
      expect(component1State2.fastLEDs[i].color.blue).toBe(0);
    }

    const [component1State3] = state3.components as FastLEDState[];

    for (let i = 0; i < 60; i += 1) {
      expect(component1State3.fastLEDs[i].color.blue).toBe(0);
      if (i == 13) {
        expect(component1State3.fastLEDs[i].color.green).toBe(170);
        expect(component1State3.preShowLEDs[i].color.green).toBe(170);
      } else if (i == 0) {
        expect(component1State3.fastLEDs[i].color.red).toBe(255);
        expect(component1State3.preShowLEDs[i].color.red).toBe(255);
      } else {
        expect(component1State3.fastLEDs[i].color.green).toBe(0);
        expect(component1State3.fastLEDs[i].color.red).toBe(0);
        expect(component1State3.preShowLEDs[i].color.red).toBe(0);
        expect(component1State3.preShowLEDs[i].color.green).toBe(0);
      }
    }
  });


  it("should be able to set all the colors of an led light strip.", () => {
    const setFastLED1Block = workspace.newBlock(
      "fastled_set_color"
    ) as BlockSvg;
    const setFastLED2Block = workspace.newBlock("fastled_set_color");
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

    setFastLED1Block
      .getInput("COLOR")
      .connection.connect(color1Block.outputConnection);
    setFastLED1Block
      .getInput("POSITION")
      .connection.connect(position1Block.outputConnection);
    setFastLED2Block
      .getInput("COLOR")
      .connection.connect(color2Block.outputConnection);
    setFastLED2Block
      .getInput("POSITION")
      .connection.connect(position2Block.outputConnection);

    connectToArduinoBlock(setFastLED1Block);
    setFastLED1Block.nextConnection.connect(
      setFastLED2Block.previousConnection
    );

    const event = createTestEvent(setFastLED1Block.id);

    const [state1, state2, state3] = eventToFrameFactory(event).frames;

    expect(state2.explanation).toBe(
      "Setting LED 1 on light strip to color (red=0,green=0,blue=100)"
    );
    expect(state2.components.length).toBe(1);
    const [component1] = state2.components as FastLEDState[];
    component1.preShowLEDs.forEach((pixel) => {
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
    expect(state3.blockId).toBe(setFastLED2Block.id);
    // expect(state3.explanation).toBe(
    //   'Setting LED 31 on light strip to color (red=0,green=0,blue=100)'
    // );
    expect(state3.components.length).toBe(1);
    const [componentv2] = state3.components as FastLEDState[];
    componentv2.preShowLEDs.forEach((pixel) => {
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
