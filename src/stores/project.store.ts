import { writable } from "svelte/store";
import authStore from "./auth.store";

const projectStore = writable<string>(null);

authStore.subscribe((auth) => {
  if (!auth.isLoggedIn) {
    projectStore.set(null);
  }
});

export default {
  subscribe: projectStore.subscribe,
  set: projectStore.set,
};
