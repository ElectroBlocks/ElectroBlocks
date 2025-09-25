import { writable } from "svelte/store";
import { MicroControllerType } from "../core/microcontroller/microcontroller";

const cCode = `int simple_loop_variable = 0;
struct RGB {
	int red;
	int green;
	int blue;
};




void setup() {

}


void loop() {

}
`;

const pythonCode = `# Python Code Snippet
print("Hello, World!")`;

export const codeStore = writable({
  cLang: cCode,
  pythonLang: pythonCode,
});

export default {
  set: codeStore.set,
  update: codeStore.update,
  subscribe: codeStore.subscribe,
};
