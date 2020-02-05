import forLoopChangeText from "./forLoopChangeText";
import deleteVariable from "./deleteVariable";
const registerEvents = (workspace) => {
    workspace.addChangeListener(async (event) => {
        if (event.element === 'disabled' ||
            event.element === 'warningOpen' ||
            event.blockId === null ||
            event.element === 'click' ||
            event.element === 'selected' ||
            event.name === 'SIMPLE_DEBUG') {
            return;
        }
        forLoopChangeText();
        deleteVariable();
    });
};
export default registerEvents;
