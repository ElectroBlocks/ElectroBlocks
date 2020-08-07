import {
  SyncComponent,
  CreateComponent,
  ResetComponent,
} from '../svg.component';
import { ArduinoComponentType } from '../../frames/arduino.frame';
import { ServoState } from '../../frames/arduino-components.state';
import {
  componentToSvgId,
  findSvgElement,
  createComponentEl,
  findArduinoEl,
  addWireConnectionClass,
} from '../svg-helpers';
import servoSVGText from '../svgs/servo/servo.svg';
import { Svg, Text, Element } from '@svgdotjs/svg.js';
import {
  createWire,
  createGroundWire,
  createPowerWire,
  updateWires,
} from '../wire';
import { ARDUINO_UNO_PINS } from '../../blockly/selectBoard';
import { positionComponent } from '../svg-position';
import { addDraggableEvent } from '../component-events.helpers';

export const servoReset: ResetComponent = (servoEl) => {
  setDegrees(servoEl, 0);
  setText(servoEl, 0);
};

export const servoUpdate: SyncComponent = (state, frame, draw) => {
  const servoState = state as ServoState;
  const id = componentToSvgId(servoState);
  let servoEl = draw.find('#' + id).pop();

  if (!servoEl) {
    return;
  }

  setDegrees(servoEl, servoState.degree);

  setText(servoEl, servoState.degree);
};

export const servoCreate: CreateComponent = (state, frame, draw) => {
  const servoState = state as ServoState;

  const id = componentToSvgId(servoState);
  let servoEl = draw.find('#' + id).pop();

  const arduino = findArduinoEl(draw);
  const pin = state.pins[0];

  if (servoEl) {
    positionComponent(servoEl, arduino, draw, pin, 'PIN_DATA');
    updateWires(servoEl, draw, arduino as Svg);
    setDegrees(servoEl, 0);
    setText(servoEl, 0);
    return;
  }

  servoEl = createComponentEl(draw, state, servoSVGText);

  (window as any).servoEl = servoEl;
  setServoPinText(servoEl, state as ServoState);

  positionComponent(servoEl, arduino, draw, pin, 'PIN_DATA');
  createWires(servoEl, pin, arduino as Svg, draw, id);
  addDraggableEvent(servoEl, arduino, draw);

  setDegrees(servoEl, 0);
  setText(servoEl, 0);
};

const setServoPinText = (servoEl: Element, servoState: ServoState) => {
  const servoName = servoEl.findOne('#servo_pin') as Text;
  servoName.node.textContent = servoState.pins[0].toString();
};

const setText = (servoEl: Element, degrees: number) => {
  const degreeText = servoEl.findOne('#degrees') as Text;

  degreeText.node.textContent = `${degrees}˚`;
  degreeText.cx(40);

  servoEl.findOne('title').node.innerHTML = 'Servo';
};

const setDegrees = (servoEl: Element, degrees: number) => {
  // TODO FIX DEGREES
  const servoBoundBox = findSvgElement('CenterOfCicle', servoEl).bbox();
  const movingPart = findSvgElement('moving_part', servoEl);
  const currentDegrees = movingPart.transform().rotate;
  movingPart.rotate(-currentDegrees, servoBoundBox.x, servoBoundBox.y);
  movingPart.rotate(-1 * (degrees + 4), servoBoundBox.cx, servoBoundBox.cy);
};

const createWires = (
  servoEl: Element,
  pin: ARDUINO_UNO_PINS,
  arduino: Svg,
  draw: Svg,
  componentId: string
) => {
  createWire(servoEl, pin, 'PIN_DATA', arduino, draw, '#FFA502', 'data');

  if ([ARDUINO_UNO_PINS.PIN_13, ARDUINO_UNO_PINS.PIN_A2].includes(pin)) {
    // GND then POWER
    createGroundWire(servoEl, pin, arduino, draw, componentId, 'left');

    createPowerWire(servoEl, pin, arduino, draw, componentId, 'left');
  }

  // POWER THEN GND

  createPowerWire(servoEl, pin, arduino, draw, componentId, 'left');

  createGroundWire(servoEl, pin, arduino, draw, componentId, 'left');
};
