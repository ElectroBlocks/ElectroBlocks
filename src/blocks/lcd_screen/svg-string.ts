import lcd_20_4_svg from "./lcd_20_4.svg?raw";
import lcd_16_2_svg from "./lcd_16_2.svg?raw";
import type { LCDScreenState } from "./state";

export const getLcdScreenSvgString = (state: LCDScreenState) => {
  return state.rows === 4 ? lcd_20_4_svg : lcd_16_2_svg;
};
