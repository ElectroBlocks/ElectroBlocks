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

  if (holes.length < 6) {
    // this component requires 6 pins
    return;
  }

  createComponentWire(
    holes[0],
    isDown,
    componentEl,
    state.pin1,
    draw,
    arduinoEl,
    id,
    "PIN_1",
    board
  );

  createComponentWire(
    holes[1],
    isDown,
    componentEl,
    state.pin2,
    draw,
    arduinoEl,
    id,
    "PIN_2",
    board
  );

  createComponentWire(
    holes[2],
    isDown,
    componentEl,
    state.pin3,
    draw,
    arduinoEl,
    id,
    "PIN_3",
    board
  );

  createComponentWire(
    holes[5],
    isDown,
    componentEl,
    state.pin4,
    draw,
    arduinoEl,
    id,
    "PIN_4",
    board
  );

  createGroundOrPowerWire(
    holes[4],
    isDown,
    componentEl,
    draw,
    arduinoEl,
    id,
    "ground"
  );

  createGroundOrPowerWire(
    holes[3],
    isDown,
    componentEl,
    draw,
    arduinoEl,
    id,
    "power"
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
