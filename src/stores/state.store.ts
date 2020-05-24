import { writable } from 'svelte/store';
import { ArduinoFrame } from '../core/frames/arduino.frame';

const stateStore = writable<ArduinoFrame[]>([]);

export default {
  subscribe: stateStore.subscribe,
  set: stateStore.set,
};
