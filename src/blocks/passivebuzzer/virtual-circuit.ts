import { Element } from "@svgdotjs/svg.js";
import {
  AfterComponentCreateHook,
  CreateWire,
  PositionComponent,
} from "../../core/virtual-circuit/svg-create";
import { positionComponent } from "../../core/virtual-circuit/svg-position";
import {
  ResetComponent,
  SyncComponent,
} from "../../core/virtual-circuit/svg-sync";
import {
  createComponentWire,
  createGroundOrPowerWire,
} from "../../core/virtual-circuit/wire";
import { PassiveBuzzerState, NOTE_TONES } from "./state";

export const afterCreatePassiveBuzzer: AfterComponentCreateHook<PassiveBuzzerState> = (
  state,
  componentEl,
  arduinoEl,
  draw,
  board
) => {
  const pin = state.pins[0];
  componentEl.findOne("#PIN_TEXT").node.textContent = pin;
};

export const updatePassiveBuzzer: SyncComponent = (
  state: PassiveBuzzerState,
  componentEl,
  draw,
  frame
) => {
  if (state.tone > 0) {
    componentEl.findOne("#NOTE_TEXT").node.textContent = state.tone.toString();
    (componentEl.findOne("#NOTE_TEXT") as Element).cx(20);

    return;
  }

  componentEl.findOne("#NOTE_TEXT").node.textContent = "";
};

export const positionPassiveBuzzer: PositionComponent<PassiveBuzzerState> = (
  state,
  componentEl,
  arduinoEl,
  draw,
  board,
  area
) => {
  const { holes, isDown } = area;
  positionComponent(componentEl, arduinoEl, draw, holes[0], isDown, "PIN_GND");
};

export const createWiresPassiveBuzzer: CreateWire<PassiveBuzzerState> = (
  state,
  draw,
  passiveBuzzerEl,
  arduinoEl,
  componentId,
  board,
  area
) => {
  const { holes, isDown } = area;

  createGroundOrPowerWire(
    holes[0],
    isDown,
    passiveBuzzerEl,
    draw,
    arduinoEl,
    componentId,
    "ground"
  );

  createComponentWire(
    holes[3],
    isDown,
    passiveBuzzerEl,
    state.pins[0],
    draw,
    arduinoEl,
    componentId,
    "PIN_DATA",
    board
  );
};

export const resetPassiveBuzzer: ResetComponent = (component) => {
  component.findOne("#NOTE_TEXT").node.textContent = "";
};
