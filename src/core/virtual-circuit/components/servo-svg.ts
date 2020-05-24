import { SyncComponent, CreateComponent } from '../svg.component';
import { ArduinoComponentType } from '../../frames/state/arduino.state';
import { ServoState } from '../../frames/state/arduino-components.state';
import { componentToSvgId, findSvgElement } from '../svg-helpers';
import servoSVGText from '../svgs/servo/servo.svg';
import { Svg, Text, Element } from '@svgdotjs/svg.js';
import {
  createWire,
  createGroundWire,
  createPowerWire,
  updateWires,
} from '../wire';
import { ARDUINO_UNO_PINS } from '../../../constants/arduino';
import { positionComponent } from '../svg-position';

export const servoUpdate: SyncComponent = (state, draw) => {
  if (state.type !== ArduinoComponentType.SERVO) {
    return;
  }
  const servoState = state as ServoState;
  const id = componentToSvgId(servoState);
  let servoEl = draw.find('#' + id).pop();
  if (!servoEl) {
    return;
  }
  console.log('update called');
  setDegrees(servoEl, servoState.degree);

  setText(servoEl, servoState);
};

export const servoCreate: CreateComponent = (state, draw) => {
  if (state.type !== ArduinoComponentType.SERVO) {
    return;
  }
  const servoState = state as ServoState;

  const id = componentToSvgId(servoState);
  const pin = state.pins[0];
  let servoEl = draw.find('#' + id).pop();
  const arduino = draw.findOne('#arduino_main_svg') as Element;

  if (servoEl) {
    positionComponent(servoEl, arduino, draw, pin, 'DATA_BOX');
    updateWires(servoEl, draw, arduino as Svg);
    return;
  }

  servoEl = draw.svg(servoSVGText).last();
  servoEl.addClass('component');
  servoEl.attr('id', id);
  servoEl.findOne('#HELPER_TEXT').hide();
  (servoEl as Svg).viewbox(0, 0, servoEl.width(), servoEl.height());
  servoEl.attr('degrees', 0);
  (window as any).servoEl = servoEl;
  setServoPinText(servoEl, state as ServoState);

  positionComponent(servoEl, arduino, draw, pin, 'DATA_BOX');
  createWires(servoEl, pin, arduino as Svg, draw, id);

  (servoEl as any).draggable().on('dragmove', () => {
    updateWires(servoEl, draw, arduino as Svg);
  });

  servoEl.findOne('#GND_BOX').addClass('wire-connection');
  servoEl.findOne('#DATA_BOX').addClass('wire-connection');
  servoEl.findOne('#_5V_BOX').addClass('wire-connection');
  servoEl.findOne('#GND_BOX').on('click', (e) => {
    e.stopPropagation();
    showToolTip(servoEl, '#9e6b18', 'GND');
  });
  servoEl.findOne('#DATA_BOX').on('click', (e) => {
    e.stopPropagation();
    showToolTip(servoEl, '#ffa500', 'DATA');
  });

  servoEl.findOne('#_5V_BOX').on('click', (e) => {
    e.stopPropagation();
    showToolTip(servoEl, '#ff422a', 'POWER');
  });

  draw.on('click', () => {
    hideToolTip(servoEl);
  });
};

const showToolTip = (servoEl: Element, color: string, wireType: string) => {
  servoEl.findOne('#HELPER_TEXT').show();
  findSvgElement('WIRE_DISPLAY', servoEl).fill(color);
  const wireText = findSvgElement('WIRE_TYPE', servoEl) as Text;
  wireText.node.textContent = wireType;
  wireText.cx(43);
  findSvgElement('HELPER_TEXT', servoEl).show();
};

const hideToolTip = (servoEl: Element) => {
  servoEl.findOne('#HELPER_TEXT').hide();
};

const setServoPinText = (servoEl: Element, servoState: ServoState) => {
  const servoName = servoEl.findOne('#servo_pin') as Text;

  servoName.node.textContent = servoState.pins[0].toString();
  servoName.fill('#fff');

  servoName.cx(20);
};

const setText = (servoEl: Element, servoState: ServoState) => {
  const degreeText = servoEl.findOne('#degrees') as Text;

  degreeText.node.textContent = `${servoState.degree}˚`;
  degreeText.cx(40);

  servoEl.findOne('title').node.innerHTML = 'Servo';
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
