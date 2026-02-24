import { writable } from 'svelte/store';

const currentFrameNumber = writable(0);

export default {
  subscribe: currentFrameNumber.subscribe,
  update: currentFrameNumber.update,
  set: currentFrameNumber.set,
};
