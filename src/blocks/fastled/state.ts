import type {
  ArduinoComponentState,
  Color,
} from '../../core/frames/arduino.frame';

export interface FastLEDState extends ArduinoComponentState {
  numberOfLeds: number;
  fastLEDs: Array<{ position: number; color: Color }>;
  preShowLEDs: Array<{ position: number; color: Color }>;
}
