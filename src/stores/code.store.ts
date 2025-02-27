import { writable } from "svelte/store";
import { MicroControllerType } from "../core/microcontroller/microcontroller";

const resetCCode = `int simple_loop_variable = 0;
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

const resetPythonCode = `# Python Code Snippet
print("Hello, World!")`;

const codeStore = writable({
  code: resetCCode, //For Backwards Compatability
  c: resetCCode,
  python: resetPythonCode,
  boardType: MicroControllerType.ARDUINO_UNO,
});

// So this works for now, but throws an undefined 'e' error, once i click save on the settings tab. 
// TODO: Check settings store or model.ts and find where the issue is.

export default {
  set: codeStore.set,
  subscribe: codeStore.subscribe,
  resetCode: (boardType: MicroControllerType) => 
    codeStore.set({code: resetCCode}),
  resetPythonCode: () => 
    codeStore.set({python: resetPythonCode}),
  
  };
