import { writable } from 'svelte/store';
import { ArduinoState } from '../core/frames/state/arduino.state';

const stateStore = writable<ArduinoState[]>([]);

export default {
  subscribe: stateStore.subscribe,
  set: stateStore.set,
};
