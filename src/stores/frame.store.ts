import { writable } from "svelte/store";
import type { ArduinoFrameContainer } from "../core/frames/arduino.frame";
import { MicroControllerType } from "../core/microcontroller/microcontroller";

const stateStore = writable<ArduinoFrameContainer>({
  frames: [],
  board: MicroControllerType.ARDUINO_UNO,
  error: false,
});

export const isContinousModeStore = writable<boolean>(false);


export default {
  subscribe: stateStore.subscribe,
  set: stateStore.set,
  update: stateStore.update,
};
