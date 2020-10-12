import { debugHelp } from "../blocks/debug/help";
import type { Help } from "./help-model";

const helpList: { [blockName: string]: Help } = {
    debug: debugHelp
}

export const getBlockHelp = (blockName: string) => {
    if (helpList[blockName]) {
        return helpList[blockName];
    }

    return undefined;
}