import { writable } from "svelte/store";
import { ArduinoFrameContainer } from "../core/frames/arduino.frame";
import { MicroControllerType } from "../core/microcontroller/microcontroller";

const stateStore = writable<ArduinoFrameContainer>({
  frames: [],
  board: MicroControllerType.ARDUINO_UNO,
});

export default {
  subscribe: stateStore.subscribe,
  set: stateStore.set,
};
