import { writable } from 'svelte/store';
import { ArduinoFrame } from '../core/frames/arduino.frame';

const currentFrameStore = writable<ArduinoFrame>(undefined);

export default {
  subscribe: currentFrameStore.subscribe,
  set: currentFrameStore.set,
};
