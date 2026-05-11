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
  createComponentWireDirect,
  createGroundOrPowerWire,
  createGroundOrPowerWireDirect,
} from "../../core/virtual-circuit/wire";
import { StepperMotorState } from "./state";

export const positionStepperMotor: PositionComponent<StepperMotorState> = (
  state,
  componentEl,
  arduinoEl,
  draw,
  board,
  area
) => {
  const { isDown, holes } = area;
  positionComponent(componentEl, arduinoEl, draw, holes[4], isDown, "PIN_GND");
};

export const updateStepperMotor: SyncComponent = (
  state: StepperMotorState,
  componentEl,
  draw,
  frame
) => {
  const degreesPerStep = 360 / state.totalSteps;
  const rotateTextEl = componentEl.findOne("#ROTATE_TEXT") as Element;
  const rotateAroundEl = componentEl.findOne("#ROTATE") as Element;
  const rotatingEl = componentEl.findOne("#ROTATING_PIECE") as Element;
  const cx = rotateAroundEl.cx();
  const cy = rotateAroundEl.cy();

  rotateTextEl.node.textContent = `Moved ${state.steps} Steps`;
  rotateTextEl.cx(cx + 13);

  const currentElSteps = rotateTextEl.data("steps") || 0;

  const diffSteps = state.currentRotation - currentElSteps;

  rotatingEl.rotate(diffSteps * degreesPerStep, cx, cy);

  rotateTextEl.data("steps", state.currentRotation);
};

export const createWireStepperMotor: CreateWire<StepperMotorState> = (
  state,
  draw,
  componentEl,
  arduinoEl,
  id,
  board,
  area
) => {
  const { isDown, holes } = area;
  console.log(holes);
  if (holes.length < 6) {
    // this component requires 6 pins
    return;
  }

  createComponentWireDirect(
    componentEl,
    state.pin1,
    draw,
    arduinoEl,
    id,
    "PIN_1",
    board,
  );

  createComponentWireDirect(
    componentEl,
    state.pin2,
    draw,
    arduinoEl,
    id,
    "PIN_2",
    board,
  );

  createComponentWireDirect(
    componentEl,
    state.pin3,
    draw,
    arduinoEl,
    id,
    "PIN_3",
    board,
  );

  createComponentWireDirect(
    componentEl,
    state.pin4,
    draw,
    arduinoEl,
    id,
    "PIN_4",
    board,
  );

  createGroundOrPowerWireDirect(
    holes[1],
    isDown,
    componentEl,
    draw,
    arduinoEl,
    id,
    "ground",
  );

  createGroundOrPowerWireDirect(
    holes[0],
    isDown,
    componentEl,
    draw,
    arduinoEl,
    id,
    "power",
  );
};

export const resetStepperMotor: ResetComponent = (componentEl) => {
  const rotateTextEl = componentEl.findOne("#ROTATE_TEXT") as Element;
  const rotateAroundEl = componentEl.findOne("#ROTATE") as Element;
  const rotatingEl = componentEl.findOne("#ROTATING_PIECE") as Element;
  const cx = rotateAroundEl.cx();
  const cy = rotateAroundEl.cy();
  rotatingEl.rotate(0, cx, cy);
  rotateTextEl.node.textContent = "";
  rotateTextEl.data("steps", "0");
};
