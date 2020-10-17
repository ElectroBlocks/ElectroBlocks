import { writable } from "svelte/store";
import { ArduinoFrameContainer } from "../core/frames/arduino.frame";
import { MicroControllerType } from "../core/microcontroller/microcontroller";
import { defaultSetting } from "./settings.store";

const stateStore = writable<ArduinoFrameContainer>({
  frames: [],
  board: MicroControllerType.ARDUINO_UNO,
  error: false,
  settings: defaultSetting,
});

export default {
  subscribe: stateStore.subscribe,
  set: stateStore.set,
};
