import { SyncComponent, ResetComponent } from '../svg-sync';
import { CreateComponentHook, CreateWire } from '../svg-create';

import { ServoState } from '../../frames/arduino-components.state';
import { componentToSvgId, findSvgElement } from '../svg-helpers';
import { Svg, Text, Element } from '@svgdotjs/svg.js';
import { createWire, createGroundWire, createPowerWire } from '../wire';
import { ARDUINO_UNO_PINS } from '../../blockly/selectBoard';
import { positionComponent } from '../svg-position';
import { addDraggableEvent } from '../component-events.helpers';

export const servoReset: ResetComponent = (servoEl) => {
  setDegrees(servoEl, 0);
  setText(servoEl, 0);
};

export const servoUpdate: SyncComponent = (state, draw) => {
  const servoState = state as ServoState;
  const id = componentToSvgId(servoState);
  let servoEl = draw.find('#' + id).pop();

  if (!servoEl) {
    return;
  }

  setDegrees(servoEl, servoState.degree);

  setText(servoEl, servoState.degree);
};

export const servoCreate: CreateComponentHook<ServoState> = (
  state,
  servoEl,
  arduinoEl,
  draw
) => {
  positionComponent(servoEl, arduinoEl, draw, state.pins[0], 'PIN_DATA');

  setServoPinText(servoEl, state);
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

export const createWiresServo: CreateWire<ServoState> = (
  state,
  draw,
  servoEl,
  arduino,
  id
) => {
  const pin = state.pins[0];
  createWire(servoEl, pin, 'PIN_DATA', arduino, draw, '#FFA502', 'data');

  if ([ARDUINO_UNO_PINS.PIN_13, ARDUINO_UNO_PINS.PIN_A2].includes(pin)) {
    // GND then POWER
    createGroundWire(servoEl, pin, arduino as Svg, draw, id, 'left');

    createPowerWire(servoEl, pin, arduino as Svg, draw, id, 'left');
  }

  // POWER THEN GND

  createPowerWire(servoEl, pin, arduino as Svg, draw, id, 'left');

  createGroundWire(servoEl, pin, arduino as Svg, draw, id, 'left');
};
