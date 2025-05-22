import { ArduinoComponentType } from "../../frames/arduino.frame";
import { SUPPORTED_LANGUAGES } from "../../microcontroller/microcontroller";
import { BlockEvent } from "../dto/event.type";
import { ActionType, UpdateRGBLEDSetup } from "./actions";

export const updateRGBLEDBlockSupportLang =
  (lang: SUPPORTED_LANGUAGES) =>
    (event: BlockEvent): UpdateRGBLEDSetup[] => {
    const { blocks, blockId } = event;

     const rgbLedBlock = event.blocks.find(
      (b) => b.blockName == "rgb_led_setup"
    );
      if (!rgbLedBlock) {
        return [];
      }

    
    return [
      {
        blockId: blockId,
        showNumberOfRgbLeds: lang === SUPPORTED_LANGUAGES.C,
        type: ActionType.UPGRADE_RGB_LED_SETUP,
      },
    ];
  };
