import { writable } from 'svelte/store';
import { ArduinoState } from '../core/frames/state/arduino.state';

const currentStateState = writable(undefined);

export default {
  subscribe: currentStateState.subscribe,
  set: currentStateState.set,
};
