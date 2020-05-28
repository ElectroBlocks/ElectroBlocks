import { writable } from 'svelte/store';

const currentFrameNumber = writable(0);

export default {
  subscribe: currentFrameNumber.subscribe,
  set: currentFrameNumber.set,
};
