import { writable } from "svelte/store";
import type { Project } from "../firebase/model";
import authStore from "./auth.store";

const projectStore = writable<{
  project: Project;
  projectId: string;
}>({
  project: null,
  projectId: null,
});

authStore.subscribe((auth) => {
  if (!auth.isLoggedIn) {
    projectStore.set({ project: null, projectId: null });
  }
});

export default {
  subscribe: projectStore.subscribe,
  set: projectStore.set,
};
