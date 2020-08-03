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
    positionComponent(servoEl, arduino, draw, pin, 'DATA_BOX');
    updateWires(servoEl, draw, arduino as Svg);
    setDegrees(servoEl, 0);
    setText(servoEl, 0);
    return;
  }

  servoEl = createComponentEl(draw, state, servoSVGText);

  servoEl.findOne('#HELPER_TEXT').hide();
  servoEl.attr('degrees', 0);

  (window as any).servoEl = servoEl;
  setServoPinText(servoEl, state as ServoState);

  unHighlightAllPins(servoEl);
  addWireConnectionClass(
    [
      'GND_BOX',
      'DATA_BOX',
      '_5V_BOX',
      'HELPER_PIN_DATA',
      'HELPER_PIN_GND',
      'HELPER_PIN_VCC',
      'CLOSE',
    ],
    servoEl
  );

  registerShowToolTip(servoEl, 'GND_BOX', 'GND');
  registerShowToolTip(servoEl, 'DATA_BOX', 'DATA');
  registerShowToolTip(servoEl, '_5V_BOX', 'POWER');
  registerShowToolTip(servoEl, 'HELPER_PIN_GND', 'GND');
  registerShowToolTip(servoEl, 'HELPER_PIN_DATA', 'DATA');
  registerShowToolTip(servoEl, 'HELPER_PIN_VCC', 'POWER');

  servoEl.findOne('#CLOSE').on('click', () => {
    unHighlightAllPins(servoEl);
    servoEl.findOne('#HELPER_TEXT').hide();
  });

  positionComponent(servoEl, arduino, draw, pin, 'DATA_BOX');
  createWires(servoEl, pin, arduino as Svg, draw, id);
  addDraggableEvent(servoEl, arduino, draw);

  setDegrees(servoEl, 0);
  setText(servoEl, 0);
};

const showToolTip = (servoEl: Element, wireType: string) => {
  unHighlightAllPins(servoEl);
  if (wireType === 'GND') {
    findSvgElement('HELPER_PIN_GND', servoEl).stroke({ width: 3 });
    findSvgElement('GND_BOX', servoEl).stroke({ width: 2 });
  } else if (wireType === 'POWER') {
    findSvgElement('HELPER_PIN_VCC', servoEl).stroke({ width: 3 });
    findSvgElement('_5V_BOX', servoEl).stroke({ width: 2 });
  } else if (wireType === 'DATA') {
    findSvgElement('HELPER_PIN_DATA', servoEl).stroke({ width: 3 });
    findSvgElement('DATA_BOX', servoEl).stroke({ width: 2 });
  }

  servoEl.findOne('#HELPER_TEXT').show();
};

const setServoPinText = (servoEl: Element, servoState: ServoState) => {
  const servoName = servoEl.findOne('#servo_pin') as Text;
  servoName.node.style.pointerEvents = 'none'; // diasable pointer event because the number is hiding the wire boxes

  servoName.node.textContent = servoState.pins[0].toString();
  servoName.fill('#fff');

  servoName.cx(20);
};

const setText = (servoEl: Element, degrees: number) => {
  const degreeText = servoEl.findOne('#degrees') as Text;

  degreeText.node.textContent = `${degrees}˚`;
  degreeText.cx(40);

  servoEl.findOne('title').node.innerHTML = 'Servo';
};

const unHighlightAllPins = (helpTextEl: Element) => {
  findSvgElement('HELPER_PIN_VCC', helpTextEl).stroke({ width: 0 });
  findSvgElement('HELPER_PIN_GND', helpTextEl).stroke({ width: 0 });
  findSvgElement('HELPER_PIN_DATA', helpTextEl).stroke({ width: 0 });

  findSvgElement('DATA_BOX', helpTextEl).stroke({ width: 0 });
  findSvgElement('GND_BOX', helpTextEl).stroke({ width: 0 });
  findSvgElement('_5V_BOX', helpTextEl).stroke({ width: 0 });
};

const setDegrees = (servoEl: Element, degrees: number) => {
  // TODO FIX DEGREES
  const servoBoundBox = findSvgElement('CenterOfCicle', servoEl).bbox();
  const movingPart = findSvgElement('moving_part', servoEl);
  const currentDegrees = movingPart.transform().rotate;
  movingPart.rotate(-currentDegrees, servoBoundBox.x, servoBoundBox.y);
  console.log('called');

  movingPart.rotate(-1 * (degrees + 4), servoBoundBox.cx, servoBoundBox.cy);
  servoEl.attr('degrees', degrees);
};

const registerShowToolTip = (
  servoEl: Element,
  id: string,
  highlightType: string
) => {
  servoEl.findOne('#' + id).on('click', (e) => {
    e.stopPropagation();
    showToolTip(servoEl, highlightType);
  });
};

const createWires = (
  servoEl: Element,
  pin: ARDUINO_UNO_PINS,
  arduino: Svg,
  draw: Svg,
  componentId: string
) => {
  const dataWire = createWire(
    servoEl,
    pin,
    'DATA_BOX',
    arduino,
    draw,
    '#FFA502',
    'data'
  );

  if ([ARDUINO_UNO_PINS.PIN_13, ARDUINO_UNO_PINS.PIN_A2].includes(pin)) {
    // GND then POWER
    const gndWire = createGroundWire(
      servoEl,
      pin,
      arduino,
      draw,
      'GND_BOX',
      componentId,
      'left'
    );

    const powerWire = createPowerWire(
      servoEl,
      pin,
      arduino,
      draw,
      '_5V_BOX',
      componentId,
      'left'
    );

    return { dataWire, gndWire, powerWire };
  }

  // POWER THEN GND

  const powerWire = createPowerWire(
    servoEl,
    pin,
    arduino,
    draw,
    '_5V_BOX',
    componentId,
    'left'
  );

  const gndWire = createGroundWire(
    servoEl,
    pin,
    arduino,
    draw,
    'GND_BOX',
    componentId,
    'left'
  );

  return { dataWire, gndWire, powerWire };
};
