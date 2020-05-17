import { SyncComponent } from '../svg.component';
import { ArduinoComponentType } from '../../frames/state/arduino.state';
import { ServoState } from '../../frames/state/arduino-components.state';
import { componentToSvgId, positionComponent } from '../svg-helpers';
import servoSVGText from '../svgs/servo-1.svg';
import pinHelerSVGText from '../svgs/pin-helper.svg';
import { Svg, Text, Element } from '@svgdotjs/svg.js';

export const servoSync: SyncComponent = (state, draw) => {
  if (state.type !== ArduinoComponentType.SERVO) {
    return;
  }

  const servoState = state as ServoState;

  const id = componentToSvgId(servoState);

  let servoEl = draw.find('#' + id).pop();
  const arduino = draw.findOne('#arduino_main_svg') as Element;
  if (!servoEl) {
    servoEl = draw.svg(servoSVGText).last();
    servoEl.width(draw.height() * 0.2);
    console.log(draw.width() * 0.2, 'servo width');
    servoEl.addClass('component');
    servoEl.attr('id', id);
    (servoEl as Svg).viewbox(0, 0, servoEl.width(), servoEl.height());
    servoEl.attr('degrees', 0);
    (servoEl as any).draggable();
    (window as any).servoEl = servoEl;
    positionComponent(servoEl, arduino, draw, state.pins[0], 'DATA_BOX');
    // servoEl.x(
    //   arduino.x() +
    //     (draw.findOne('#pin51B') as Element).cx() -
    //     draw.width() * paddingWidth -
    //     (servoEl.findOne('#DATA_BOX') as Element).cx()
    // );

    // servoEl.y(100);
  }

  servoEl.findOne('#GND_BOX').on('mouseover', () => {
    const pinHelper = draw.svg(pinHelerSVGText).last();
    (pinHelper as any).draggable();
    (window as any).pinHelper = pinHelper;
    const gndWire = servoEl.findOne('#GND_BOX') as Element;
    pinHelper.y(gndWire.cy() + servoEl.y() - pinHelper.height());

    pinHelper.x(gndWire.cx() + servoEl.x());
  });

  setDegrees(servoEl, servoState.degree, +servoEl.attr('degrees'));

  setText(servoEl, servoState);
};

const setText = (servoEl: Element, servoState: ServoState) => {
  const degreeText = servoEl.findOne('#degrees') as Text;

  degreeText.node.textContent = `${servoState.degree}˚`;
  degreeText.cx(20);

  const servoName = servoEl.findOne('#servo_pin') as Text;

  servoName.node.textContent = servoState.pins[0].toString();
  servoName.fill('#fff');

  servoName.cx(10);

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
