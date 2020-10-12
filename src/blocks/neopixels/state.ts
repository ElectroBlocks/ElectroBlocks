import type { ArduinoComponentState, Color } from "../../core/frames/arduino.frame";

export interface NeoPixelState extends ArduinoComponentState {
  numberOfLeds: number;
  neoPixels: Array<{ position: number; color: Color }>;
}
