import { writable } from "svelte/store";
import { ArduinoFrameContainer } from "../core/frames/arduino.frame";
import { MicroControllerType } from "../core/microcontroller/microcontroller";

const stateStore = writable<ArduinoFrameContainer>({
  frames: [],
  board: MicroControllerType.ARDUINO_UNO,
  error: false,
  settings: {
    backgroundColor: "#d9e4ec",
    touchSkinColor: "#a424d3",
    ledColor: "#AA0000",
    customLedColor: false,
    maxTimePerMove: 1000,
  },
});

export default {
  subscribe: stateStore.subscribe,
  set: stateStore.set,
};
