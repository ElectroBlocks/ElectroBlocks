import {
  SyncComponent,
  ResetComponent,
} from "../../core/virtual-circuit/svg-sync";
import {
  PositionComponent,
  CreateWire,
  AfterComponentCreateHook,
} from "../../core/virtual-circuit/svg-create";

import { Element, Svg } from "@svgdotjs/svg.js";

import { positionComponent } from "../../core/virtual-circuit/svg-position";
import { TemperatureState } from "./state";
import {
  createComponentWire,
  createGroundOrPowerWire,
} from "../../core/virtual-circuit/wire";

export const createTemp: AfterComponentCreateHook<TemperatureState> = (
  state,
  tempEl
) => {
  const pinTextEl = tempEl.findOne("#PIN_TEXT") as Element;
  const cxPosition = pinTextEl.cx();
  pinTextEl.node.innerHTML = state.pins[0];
  pinTextEl.cx(cxPosition);
};

export const positionTemp: PositionComponent<TemperatureState> = (
  state,
  tempEl,
  arduinoEl,
  draw,
  board,
  area
) => {
  const { holes, isDown } = area;
  positionComponent(tempEl, arduinoEl, draw, holes[1], isDown, "PIN_DATA");
};

export const updateTemp: SyncComponent = (state: TemperatureState, tempEl) => {
  const tempTextEl = tempEl.findOne("#TEMP_TEXT") as Element;
  const humidText = tempEl.findOne("#HUMID_TEXT") as Element;
  tempTextEl.show();
  humidText.show();
  const cx = tempTextEl.cx();
  tempTextEl.node.innerHTML = `Temperature ${state.temperature}°F`;
  tempTextEl.cx(cx);
  humidText.node.innerHTML = `Humitity: ${state.humidity}%`;
  humidText.cx(cx);
};

export const resetTemp: ResetComponent = (tempEl) => {
  const tempText = tempEl.findOne("#TEMP_TEXT") as Element;
  tempText.hide();
};

export const createWiresTemp: CreateWire<TemperatureState> = (
  state,
  draw,
  componentEl,
  arduionEl,
  id,
  board,
  area
) => {
  const { holes, isDown } = area;
  createGroundOrPowerWire(
    holes[0],
    isDown,
    componentEl,
    draw,
    arduionEl,
    id,
    "power"
  );

  createComponentWire(
    holes[1],
    isDown,
    componentEl,
    state.pins[0],
    draw,
    arduionEl,
    id,
    "PIN_DATA",
    board
  );

  createGroundOrPowerWire(
    holes[2],
    isDown,
    componentEl,
    draw,
    arduionEl,
    id,
    "ground"
  );
};
