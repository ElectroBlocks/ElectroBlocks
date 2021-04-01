import type {
  SyncComponent,
  ResetComponent,
} from "../../core/virtual-circuit/svg-sync";
import type {
  PositionComponent,
  CreateWire,
  AfterComponentCreateHook,
} from "../../core/virtual-circuit/svg-create";

import type { DigitilDisplayState } from "./state";
import type { Element, Svg, Text } from "@svgdotjs/svg.js";
import { positionComponent } from "../../core/virtual-circuit/svg-position";
import {
  createComponentWire,
  createGroundOrPowerWire,
} from "../../core/virtual-circuit/wire";

export const digitalDisplayCreate: AfterComponentCreateHook<DigitilDisplayState> = (
  state,
  digitalDisplayEl
) => {
  digitalDisplayEl.findOne("#DIO_PIN_TEXT").node.innerHTML = state.dioPin;
  digitalDisplayEl.findOne("#CLK_PIN_TEXT").node.innerHTML = state.clkPin;
};

export const digitalDisplayPosition: PositionComponent<DigitilDisplayState> = (
  state,
  digitalDisplayEl,
  arduino,
  draw,
  board,
  area
) => {
  const { holes, isDown } = area;
  positionComponent(
    digitalDisplayEl,
    arduino,
    draw,
    holes[0],
    isDown,
    "PIN_GND"
  );
};

export const digitalDisplayReset: ResetComponent = (
  digitalDisplayEl: Element
) => {
  const topDotEL = digitalDisplayEl.findOne("#DOT_TOP") as Element;
  const bottomDotEL = digitalDisplayEl.findOne("#DOT_BOTTOM") as Element;
  topDotEL.fill("#FFF");
  topDotEL.fill("#FFF");
  bottomDotEL.fill("#FFF");
  bottomDotEL.stroke("#FFF");

  digitalDisplayEl.findOne(`#FRONT_1`).hide();
  digitalDisplayEl.findOne(`#FRONT_2`).hide();
  digitalDisplayEl.findOne(`#FRONT_3`).hide();
  digitalDisplayEl.findOne(`#FRONT_4`).hide();
};

export const digitalDisplayUpdate: SyncComponent = (
  state: DigitilDisplayState,
  digitalDisplayEl
) => {
  const char1 = state.chars[0] || "";
  const char2 = state.chars[1] || "";
  const char3 = state.chars[2] || "";
  const char4 = state.chars[3] || "";
  const toggleLetter = (letter: string, index: number) => {
    if (letter === "") {
      digitalDisplayEl.findOne(`#FRONT_${index}`).hide();
    } else {
      const charEl = digitalDisplayEl.findOne(`#FRONT_${index}`) as Text;
      charEl.show();
      charEl.node.innerHTML = letter;
    }
  };

  toggleLetter(char1, 1);
  toggleLetter(char2, 2);
  toggleLetter(char3, 3);
  toggleLetter(char4, 4);

  const redColor = "#E81818";
  const topDotEL = digitalDisplayEl.findOne("#DOT_TOP") as Element;
  const bottomDotEL = digitalDisplayEl.findOne("#DOT_BOTTOM") as Element;
  topDotEL.fill(state.colonOn ? redColor : "#FFF");
  bottomDotEL.fill(state.colonOn ? redColor : "#FFF");
  topDotEL.stroke(state.colonOn ? redColor : "#FFF");
  bottomDotEL.stroke(state.colonOn ? redColor : "#FFF");
};

export const createWiresDigitalDisplay: CreateWire<DigitilDisplayState> = (
  state,
  draw,
  digitalDisplayEl,
  arduino,
  id,
  board,
  area
) => {
  const { holes, isDown } = area;

  createGroundOrPowerWire(
    holes[0],
    isDown,
    digitalDisplayEl,
    draw,
    arduino,
    id,
    "ground"
  );

  createGroundOrPowerWire(
    holes[1],
    isDown,
    digitalDisplayEl,
    draw,
    arduino,
    id,
    "power"
  );

  createComponentWire(
    holes[3],
    isDown,
    digitalDisplayEl,
    state.clkPin,
    draw,
    arduino,
    id,
    "PIN_CLK",
    board
  );

  createComponentWire(
    holes[2],
    isDown,
    digitalDisplayEl,
    state.dioPin,
    draw,
    arduino,
    id,
    "PIN_DIO",
    board
  );
};
