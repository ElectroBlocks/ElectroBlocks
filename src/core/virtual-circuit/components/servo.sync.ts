import { SyncComponent, CreateComponent } from '../svg.component';
import { ArduinoComponentType } from '../../frames/arduino.frame';
import { ServoState } from '../../frames/arduino-components.state';
import { componentToSvgId, findSvgElement } from '../svg-helpers';
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

export const servoUpdate: SyncComponent = (state, _, draw) => {
  if (state.type !== ArduinoComponentType.SERVO) {
    return;
  }
  const servoState = state as ServoState;
  const id = componentToSvgId(servoState);
  let servoEl = draw.find('#' + id).pop();
  if (!servoEl) {
    return;
  }
  setDegrees(servoEl, servoState.degree);

  setText(servoEl, servoState);
};

export const servoCreate: CreateComponent = (state, _, draw) => {
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

  unHighlightAllPins(servoEl);
  servoEl.findOne('#GND_BOX').addClass('wire-connection');
  servoEl.findOne('#DATA_BOX').addClass('wire-connection');
  servoEl.findOne('#_5V_BOX').addClass('wire-connection');
  servoEl.findOne('#HELPER_PIN_DATA').addClass('wire-connection');
  servoEl.findOne('#HELPER_PIN_GND').addClass('wire-connection');
  servoEl.findOne('#HELPER_PIN_VCC').addClass('wire-connection');
  servoEl.findOne('#CLOSE').addClass('wire-connection');

  servoEl.findOne('#GND_BOX').on('click', (e) => {
    e.stopPropagation();
    showToolTip(servoEl, 'GND');
  });
  servoEl.findOne('#DATA_BOX').on('click', (e) => {
    e.stopPropagation();
    showToolTip(servoEl, 'DATA');
  });

  servoEl.findOne('#_5V_BOX').on('click', (e) => {
    e.stopPropagation();
    showToolTip(servoEl, 'POWER');
  });

  servoEl.findOne('#HELPER_PIN_GND').on('click', (e) => {
    e.stopPropagation();
    showToolTip(servoEl, 'GND');
  });
  servoEl.findOne('#HELPER_PIN_DATA').on('click', (e) => {
    e.stopPropagation();
    showToolTip(servoEl, 'DATA');
  });

  servoEl.findOne('#HELPER_PIN_VCC').on('click', (e) => {
    e.stopPropagation();
    showToolTip(servoEl, 'POWER');
  });

  servoEl.findOne('#CLOSE').on('click', () => {
    unHighlightAllPins(servoEl);
    servoEl.findOne('#HELPER_TEXT').hide();
  });
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

const setText = (servoEl: Element, servoState: ServoState) => {
  const degreeText = servoEl.findOne('#degrees') as Text;

  degreeText.node.textContent = `${servoState.degree}˚`;
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
