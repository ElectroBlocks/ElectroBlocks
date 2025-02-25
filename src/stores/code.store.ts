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
  c: resetCCode,
  python: resetPythonCode,
  boardType: MicroControllerType.ARDUINO_UNO,
});

export default {
  set: codeStore.set,
  subscribe: codeStore.subscribe,
  updateC: (newCCode: string) =>
    codeStore.update((store) => ({ ...store, c: newCode })),
  updatePy: (newPyCode: string) =>
    codeStore.update((store) => ({ ...store, python: newPyCode})),
  resetCCode: () =>
    codeStore.update((store) => ({ ...store, c: resetCode})),
  resetPyCode: () => 
    codeStore.update((store) => ({ ...store, python: resetPythonCode})),
  setBoardType: (newBoardType: MicroControllerType) =>
    codeStore.update((store) => ({ ...store, boardType: newBoardType})),
};
