import { writable } from "svelte/store";

export enum PortState {
  CLOSE = "CLOSE",
  CLOSING = "CLOSING",
  OPEN = "OPEN",
  OPENNING = "OPENNING",
  UPLOADING = "UPLOADING",
}

const storeStatus = writable<PortState>(PortState.CLOSE);

export default {
  subscribe: storeStatus.subscribe,
  set: storeStatus.set,
};
