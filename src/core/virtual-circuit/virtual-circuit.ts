import { Svg, Element } from '@svgdotjs/svg.js';
import { ArduinoState } from '../frames/state/arduino.state';

export const sync = (state: ArduinoState, draw: Svg) => {
  state.components.forEach((s) => {});
};



// export class VirtualCircuit {
//   private arduinoSVG: Element | any;

//   constructor(private draw: Svg) {
//     this.arduinoSVG = ;
//     this.arduinoSVG.draggable();
//   }

//   public syncComponents(state: ArduinoState) {

//   }

//   public syncFrame(state: ArduinoState) {

//   }

//   public destroy() {

//   }
// }
