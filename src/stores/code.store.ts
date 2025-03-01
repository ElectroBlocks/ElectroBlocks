import { writable } from "svelte/store";
import { MicroControllerType } from "../core/microcontroller/microcontroller";
import settingsStore from "../stores/settings.store";
import { get } from "svelte/store";

let settings = get(settingsStore);
  settingsStore.subscribe((newSettings) => {
    settings = newSettings;
  });

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

const resetCode = settings.language === "Python" ? resetPythonCode : resetCCode;

const codeStore = writable({
  code: resetCode, //For Backwards Compatability
  boardType: MicroControllerType.ARDUINO_UNO,
});

export default {
  set: codeStore.set,
  subscribe: codeStore.subscribe,
  resetCode: (boardType: MicroControllerType) =>
    codeStore.set({ code: resetCode, boardType }),
};