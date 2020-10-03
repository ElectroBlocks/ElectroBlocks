import lcd_20_4_svg from "./lcd_20_4.svg";
import lcd_16_2_svg from "./lcd_16_2.svg";
import { LCDScreenState } from "./state";

export const getLcdScreenSvgString = (state: LCDScreenState) => {
  return state.rows === 4 ? lcd_20_4_svg : lcd_16_2_svg;
};
