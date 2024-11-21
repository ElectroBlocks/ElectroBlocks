import { ArduinoComponentState } from "../../core/frames/arduino.frame";

export interface PassiveBuzzerState extends ArduinoComponentState {
  tone: number;
  displaySimpleOn: boolean;
}

export const Notes = {
  220: "A",
  233: "A#",
  247: "B",
  131: "C",
  139: "C#",
  147: "D",
  156: "D#",
  165: "E",
  175: "F",
  185: "F#",
  196: "G",
  208: "G#",
};

export enum NOTE_TONES {
  "NO_TONE" = 0,
  "A" = 220,
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
