import Blockly from "blockly";
import type { Block } from "blockly";

Blockly["Arduino"]["ir_remote_setup"] = function (block: Block) {
  const pin = block.getFieldValue("PIN") || "A1";
  Blockly["Arduino"].libraries_["define_ir_remote"] =
    "#include <IRremote.h>; \nIRrecv irReceiver(" +
    pin +
    ");\ndecode_results result;\n";

  Blockly["Arduino"].setupCode_["setup_ir_remote"] =
    "\tirReceiver.enableIRIn(); \n";
  return "";
};

Blockly["Arduino"]["ir_remote_has_code_receive"] = function () {
  return ["irReceiver.decode(&result)", Blockly["Arduino"].ORDER_ATOMIC];
};

Blockly["Arduino"]["ir_remote_get_code"] = function () {
  return ["String(result.value, HEX)", Blockly["Arduino"].ORDER_ATOMIC];
};
