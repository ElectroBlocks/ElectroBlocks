import { Element, Svg } from '@svgdotjs/svg.js';
import { arduinoComponentStateToId } from '../frames/arduino-component-id';
import { ArduinoFrame } from '../frames/arduino.frame';

export const centerCircuit = (draw: Svg, frame?: ArduinoFrame) => {
  const arduino = draw.findOne('#microcontroller_main_svg') as Element;
  let components = frame
    ? [
        ...frame.components.map((c) => {
          // This is done for the time component and message componet which may error out or
          // produce null values
          try {
            const id = arduinoComponentStateToId(c);
            return draw.findOne(`#${id}`) as Element;
          } catch {
            return null;
          }
        }),
        arduino,
      ]
    : [arduino];

  // Filtering out nulls like message component
  components = components.filter((c) => c);

  const tallestYValue = components.reduce((acc, next) => {
    // we are going for the least for the tallest
    return next && acc > next.y() ? next.y() : acc;
  }, 0);

  const mostNegativeX = components.reduce((acc, next) => {
    // We are going for the most negative x
    return next && acc > next.x() ? next.x() : acc;
  }, 0);

  const longestWidth = components.reduce((acc, next) => {
    const x2 = next.width() + Math.abs(next.x());

    return x2 > acc ? x2 : acc;
  }, 0);

  draw.viewbox(
    mostNegativeX, // This should start where the x begin
    tallestYValue - 10, // minus 10 for the padding
    longestWidth, // Longest width that it can be
    Math.abs(tallestYValue) + arduino.height() + 10 // This is total height.
    // tallest y will sometime be negative so we absolute value + the height of the arduino
    // We then add 10 for padding
  );
};
