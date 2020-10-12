import type { Svg } from "@svgdotjs/svg.js";
import type { ArduinoFrame } from "../frames/arduino.frame";
import { syncComponents } from "./svg-sync";
import {
  findSvgElement,
  LED_COLORS,
  findMicronControllerEl,
} from "./svg-helpers";

export default (draw: Svg, frame: ArduinoFrame = undefined) => {
  if (!frame) {
    return;
  }

  if (frame) {
    syncComponents(frame, draw);
  }
  const arduino = findMicronControllerEl(draw);

  if (arduino) {
    // BUILT IN LED ID BELOW
    // TODO BUILT IN LED
    findSvgElement("TX_LED", arduino as Svg).fill(
      frame.sendMessage.length > 0 ? LED_COLORS.LED_ON : LED_COLORS.LED_OFF
    );

    findSvgElement("BUILT_IN_LED", arduino as Svg).fill(
      frame.builtInLedOn ? LED_COLORS.LED_ON : LED_COLORS.LED_OFF
    );
  }
};
