import { writable } from "svelte/store";
import type { ArduinoFrameContainer } from "../core/frames/arduino.frame";
import { MicrocontrollerType } from "../core/microcontroller/microcontroller";
import { defaultSetting } from "../firebase/model";

const stateStore = writable<ArduinoFrameContainer>({
  frames: [],
  board: MicrocontrollerType.ARDUINO_UNO,
  error: false,
  settings: defaultSetting,
});

export default {
  subscribe: stateStore.subscribe,
  set: stateStore.set,
  update: stateStore.update,
};
