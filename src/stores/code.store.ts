import { writable } from "svelte/store";
import { Library } from "../core/frames/arduino.frame";

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

export const codeStore = writable<{
  cLang: string;
  pythonLang: string;
  imports: Library[];
  enableFlags: string[];
}>({
  cLang: cCode,
  pythonLang: pythonCode,
  imports: [],
  enableFlags: [],
});

export default {
  set: codeStore.set,
  update: codeStore.update,
  subscribe: codeStore.subscribe,
};
