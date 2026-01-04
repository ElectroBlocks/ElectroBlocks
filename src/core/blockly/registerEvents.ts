import updateForLoopText from "./actions/updateForLoopText";
import type { WorkspaceSvg } from "blockly";
import _ from "lodash";
import Blockly from "blockly";

import frameStore from "../../stores/frame.store";
import { getArduinoCode, workspaceToXML } from "./helpers/workspace.helper";

import { getAllBlocks } from "./helpers/block.helper";
import { transformBlock } from "./transformers/block.transformer";
import { transformEvent } from "./transformers/event.transformer";
import { getAllVariables } from "./helpers/variable.helper";
import { deleteUnusedVariables } from "./actions/deleteUnusedVariables";
import { saveSensorSetupBlockData } from "./actions/saveSensorSetupBlockData";
import { updateLoopNumberInSensorSetupBlock } from "./actions/updateLoopNumberInSensorSetupBlock";
import { updateSensorSetupFields } from "./actions/updateSensorSetupFields";
import { disableSetupBlocksUsingSamePinNumbers } from "./actions/disable/disableSetupBlocksUsingSamePinNumbers";
import { disableSetupBlockWithMultiplePinOutsSamePins } from "./actions/disable/disableSetupBlockWithMultiplePinOutsSamePins";
import { disableDuplicateSetupBlocks } from "./actions/disable/disableDuplicateSetupBlock";
import { disableBlockThatRequiredToBeInArduinoLoopSetupOrFunction } from "./actions/disable/disableBlockThatRequiredToBeInArduinoLoopSetupOrFunction";
import { disableDuplicatePinBlocks } from "./actions/disable/disableDuplicatePinBlocks";
import { updater } from "./updater";
import { disableSensorReadBlocksWithWrongPins } from "./actions/disable/disableSensorReadBlocksWithWrongPins";
import { disableBlocksThatNeedASetupBlock } from "./actions/disable/disableBlocksThatNeedASetupBlock";
import { ActionType, DisableBlock, EnableBlock } from "./actions/actions";
import { eventToFrameFactory } from "../frames/event-to-frame.factory";
import {
  ArduinoComponentType,
  type ArduinoFrameContainer,
} from "../frames/arduino.frame";
import type { MicroControllerType } from "../microcontroller/microcontroller";
import { getBoardType } from "./helpers/get-board.helper";
import { disableBlocksWithInvalidPinNumbers } from "./actions/disable/disableBlocksWithInvalidPinNumbers";
import settingStore from "../../stores/settings.store";
import UpdateLCDScreenPrintBlock from "./actions/updateLcdScreenPrintBlock";
import updateLedBlockColorField from "./actions/updateLedBlockColorField";
import { updateWhichComponent } from "./actions/updateWhichComponent";
import { updateFastLedSetAllColorsUpdateBlock } from "./actions/fastLedSetAllColorsUpdateBlock";
import { updateRGBLEDBlockSupportLang } from "./actions/updateRGBLEDBlockSupportLang";
import { get } from "svelte/store";
import { disableRecievingMessageBlocksForLiveModeAndPython } from "./actions/disableRecievingMessageBlocksForLiveModeAndPython";
import { SimulatorMode, simulatorStore } from "../../stores/arduino.store";
import codeStore from "../../stores/code.store";
import { onErrorMessage } from "../../help/alerts";

export const createFrames = async (blocklyEvent) => {
  if ((Blockly.getMainWorkspace() as any).isDragging()) {
    return; // Don't update while changes are happening.
  }

  if (blocklyEvent.type === Blockly.Events.VAR_DELETE) {
    console.log("Variable deletion detected:", blocklyEvent.varName);
    // Prevent the default alert from triggering
    blocklyEvent.preventDefault?.();
  }

  const supportedEvents = new Set([
    Blockly.Events.BLOCK_CHANGE,
    Blockly.Events.BLOCK_CREATE,
    Blockly.Events.BLOCK_DELETE,
    Blockly.Events.BLOCK_MOVE,
    Blockly.Events.VAR_CREATE,
    Blockly.Events.VAR_DELETE,
    Blockly.Events.VAR_RENAME,
  ]);

  if (!supportedEvents.has(blocklyEvent.type)) return;

  const microControllerType = getBoardType() as MicroControllerType;
  var settingData = get(settingStore);
  var codeData = get(codeStore);
  var simulatorMode = get(simulatorStore);
  const event = transformEvent(
    getAllBlocks(),
    getAllVariables(),
    blocklyEvent,
    microControllerType
  );

  const firstActionPass = [
    ...disableBlocksWithInvalidPinNumbers(event),
    ...disableSetupBlocksUsingSamePinNumbers(event),
    ...disableSetupBlockWithMultiplePinOutsSamePins(event),
    ...disableDuplicateSetupBlocks(event),
    ...disableBlockThatRequiredToBeInArduinoLoopSetupOrFunction(event),
    ...disableDuplicatePinBlocks(event),

    ...disableSensorReadBlocksWithWrongPins(event),
    ...disableBlocksThatNeedASetupBlock(event),
    ...disableRecievingMessageBlocksForLiveModeAndPython(
      event,
      settingData,
      simulatorMode == SimulatorMode.LIVE
    ),
  ];
  firstActionPass.forEach((a) => updater(a));
  enableBlocks(
    firstActionPass.filter(
      (a) => a.type === ActionType.DISABLE_BLOCK
    ) as DisableBlock[]
  );

  const event2 = transformEvent(
    getAllBlocks(),
    getAllVariables(),
    blocklyEvent,
    microControllerType
  );
  // We need to run this again incase anything got enable that was disabled.
  const secondActionPass = [
    ...disableBlocksWithInvalidPinNumbers(event2),
    ...disableSetupBlocksUsingSamePinNumbers(event2),
    ...disableSetupBlockWithMultiplePinOutsSamePins(event2),
    ...disableDuplicateSetupBlocks(event2),
    ...disableBlockThatRequiredToBeInArduinoLoopSetupOrFunction(event2),
    ...disableDuplicatePinBlocks(event2),

    ...disableSensorReadBlocksWithWrongPins(event2),
    ...disableBlocksThatNeedASetupBlock(event2),
    ...disableRecievingMessageBlocksForLiveModeAndPython(
      event2,
      settingData,
      simulatorMode == SimulatorMode.LIVE
    ),
  ];
  secondActionPass.forEach((a) => updater(a));
  enableBlocks(
    secondActionPass.filter(
      (a) => a.type === ActionType.DISABLE_BLOCK
    ) as DisableBlock[]
  );

  if (secondActionPass.filter((a) => a.stopCompiling).length >= 1) {
    let defaultFrames = {
      error: true,
      frames: [],
      board: event.microController,
    };
    frameStore.set(defaultFrames);
    if (
      codeData.canShowCodeErrorMessage &&
      simulatorMode != SimulatorMode.LIVE
    ) {
      onErrorMessage(
        "Please fix the highlighted blocks and try again.\nLook for blocks with a ⚠️ symbol.",
        {},
        "Your program isn't ready to run yet."
      );
    }
    codeStore.set({
      cLang: `// Your program isn’t ready to run yet.
// Please fix the highlighted blocks before continuing.`,
      pythonLang: `# Your program isn’t ready to run yet.
# Please fix the highlighted blocks before continuing.`,
      imports: [],
      enableFlags: [],
      canShowCodeErrorMessage: false,
    });
    return false;
  }
  const thirdActionPass = [
    ...updateRGBLEDBlockSupportLang(settingData.language)(event2),
    ...deleteUnusedVariables(event2),
    ...saveSensorSetupBlockData(event2),
    ...updateSensorSetupFields(event2),
    ...updateForLoopText(event2),
    ...UpdateLCDScreenPrintBlock(event2),
    ...updateLoopNumberInSensorSetupBlock(event2),
    ...updateLedBlockColorField(event2),
    ...updateWhichComponent(
      "rgb_led_setup",
      ["set_color_led", "set_simple_color_led", "rgb_led_setup"],
      ArduinoComponentType.LED_COLOR
    )(event2),
    ...updateWhichComponent(
      "motor_setup",
      ["move_motor", "stop_motor", "motor_setup"],
      ArduinoComponentType.MOTOR
    )(event2),
    ...updateFastLedSetAllColorsUpdateBlock(event2),
  ];

  thirdActionPass.forEach((a) => updater(a));

  // We need this because we save the sensor setup data to the
  // block.
  const refreshEvent = transformEvent(
    getAllBlocks(),
    getAllVariables(),
    blocklyEvent,
    microControllerType
  );

  const newFrameContainer = eventToFrameFactory(refreshEvent);
  const currentFrameContainter = get(frameStore);
  const imports =
    newFrameContainer?.frames.length == 0
      ? []
      : newFrameContainer.frames[
          newFrameContainer.frames.length - 1
        ].components.reduce((prev, next) => {
          if (next?.importLibraries) {
            return [...prev, ...next.importLibraries];
          }
          return [...prev];
        }, []);
  const enableFlags: string[] =
    newFrameContainer?.frames.length > 0
      ? newFrameContainer.frames[
          newFrameContainer.frames.length - 1
        ].components.reduce((prev, next) => {
          if (next?.enableFlag) {
            return [...prev, next?.enableFlag];
          }
          return [...prev];
        }, [])
      : [];

  if (
    currentFrameContainter === undefined ||
    JSON.stringify(newFrameContainer) !== JSON.stringify(currentFrameContainter)
  ) {
    codeStore.set({
      cLang: getArduinoCode("Arduino"),
      pythonLang: getArduinoCode("Python"),
      imports,
      enableFlags,
      canShowCodeErrorMessage: true,
    });
    frameStore.set(newFrameContainer);
    return true;
  }

  return true;
};

const enableBlocks = (actions: DisableBlock[]) => {
  const disabledBlockIds = actions
    .filter((d) => d.type === ActionType.DISABLE_BLOCK)
    .map((a: DisableBlock) => a.blockId);

  const enableActions: EnableBlock[] = getAllBlocks()
    .map(transformBlock)
    .filter((b) => !disabledBlockIds.includes(b.id))
    .map((b) => {
      return {
        type: ActionType.ENABLE_BLOCK,
        blockId: b.id,
      };
    });

  enableActions.forEach((a) => updater(a));
};

function saveToLocalStorage() {
  const recentBlocks = workspaceToXML();
  localStorage.setItem("reload_once_workspace", recentBlocks);
}

export const addListener = (workspace: WorkspaceSvg) => {
  workspace.addChangeListener(createFrames);
  workspace.addChangeListener(saveToLocalStorage);
};
