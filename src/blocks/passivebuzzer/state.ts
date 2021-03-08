import { ArduinoComponentState } from "../../core/frames/arduino.frame";

export interface PassiveBuzzerState extends ArduinoComponentState {
  tone: number;
}

export enum NOTE_TONES {
  NO_TONE = 0,
  A = 220,
  "A#" = 233,
  "B" = 247,
  "C" = 131,
  "C#" = 139,
  "D" = 147,
  "D#" = 156,
  "E" = 165,
  "F" = 175,
  "F#" = 185,
  "G" = 196,
  "G#" = 208,
}
