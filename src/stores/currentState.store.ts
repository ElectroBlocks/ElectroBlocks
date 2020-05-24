import { writable } from 'svelte/store';
import { ArduinoFrame } from '../core/frames/arduino.frame';

const currentStateState = writable(undefined);

export default {
  subscribe: currentStateState.subscribe,
  set: currentStateState.set,
};
