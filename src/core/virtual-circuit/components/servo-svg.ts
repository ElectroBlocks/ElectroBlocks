import { SyncComponent } from '../svg.component';
import { ArduinoComponentType } from '../../frames/state/arduino.state';
import { ServoState } from '../../frames/state/arduino-components.state';
import {
  componentToSvgId,
  positionComponent,
  findSvgElement,
} from '../svg-helpers';
import servoSVGText from '../svgs/servo/servo.svg';
import { Svg, Text, Element } from '@svgdotjs/svg.js';
import {
  createWire,
  updateWire,
  createGroundWire,
  createPowerWire,
} from '../wire';
import { ARDUINO_UNO_PINS } from '../../../constants/arduino';

export const servoSync: SyncComponent = (state, draw) => {
  if (state.type !== ArduinoComponentType.SERVO) {
    return;
  }

  const servoState = state as ServoState;

  const id = componentToSvgId(servoState);

  let servoEl = draw.find('#' + id).pop();
  const arduino = draw.findOne('#arduino_main_svg') as Element;
  if (!servoEl) {
    const pin = state.pins[0];
    servoEl = draw.svg(servoSVGText).last();
    servoEl.addClass('component');
    servoEl.attr('id', id);
    servoEl.findOne('#HELPER_TEXT').hide();
    (servoEl as Svg).viewbox(0, 0, servoEl.width(), servoEl.height());
    servoEl.attr('degrees', 0);
    (window as any).servoEl = servoEl;
    draw.line();
    positionComponent(servoEl, arduino, draw, pin, 'DATA_BOX');
    const { dataWire, gndWire, powerWire } = createWires(
      servoEl,
      pin,
      arduino as Svg,
      draw,
      id
    );

    (servoEl as any).draggable().on('dragmove', () => {
      updateWire(servoEl, 'DATA_BOX', dataWire);
      updateWire(servoEl, 'GND_BOX', gndWire);
      updateWire(servoEl, '_5V_BOX', powerWire);
    });

    // servoEl.x(
    //   arduino.x() +
    //     (draw.findOne('#pin51B') as Element).cx() -
    //     draw.width() * paddingWidth -
    //     (servoEl.findOne('#DATA_BOX') as Element).cx()
    // );

    // servoEl.y(100);
  }

  servoEl.findOne('#GND_BOX').css('cursor', 'pointer');
  servoEl.findOne('#DATA_BOX').css('cursor', 'pointer');
  servoEl.findOne('#_5V_BOX').css('cursor', 'pointer');
  servoEl
    .findOne('#GND_BOX')
    .on('mouseover', () => {
      showToolTip(servoEl, '#9e6b18', 'GND');
    })
    .on('mouseleave', () => {
      hideToolTip(servoEl);
    });
  servoEl
    .findOne('#DATA_BOX')
    .on('mouseover', () => {
      showToolTip(servoEl, '#ffa500', 'DATA');
    })
    .on('mouseleave', () => {
      hideToolTip(servoEl);
    });

  servoEl
    .findOne('#_5V_BOX')
    .on('mouseover', () => {
      showToolTip(servoEl, '#ff422a', 'POWER');
    })
    .on('mouseleave', () => {
      hideToolTip(servoEl);
    });

  setDegrees(servoEl, servoState.degree, +servoEl.attr('degrees'));

  setText(servoEl, servoState);
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

const setText = (servoEl: Element, servoState: ServoState) => {
  const degreeText = servoEl.findOne('#degrees') as Text;

  degreeText.node.textContent = `${servoState.degree}˚`;
  degreeText.cx(40);

  const servoName = servoEl.findOne('#servo_pin') as Text;

  servoName.node.textContent = servoState.pins[0].toString();
  servoName.fill('#fff');

  servoName.cx(20);

  servoEl.findOne('title').node.innerHTML = 'Servo';
};

const setDegrees = (servoEl: Element, degrees: number, currentDegrees = 0) => {
  if (degrees === currentDegrees) {
    return;
  }

  const servoBoundBox = servoEl.find('#CenterOfCicle').pop().bbox();

  if (currentDegrees !== 0) {
    servoEl
      .find('#moving_part')
      .pop()
      .rotate(currentDegrees + 4, servoBoundBox.x, servoBoundBox.y);
    console.log('called');
  }

  servoEl
    .find('#moving_part')
    .pop()
    .rotate(-1 * (degrees + 4), servoBoundBox.x, servoBoundBox.y);
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
    componentId,
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
