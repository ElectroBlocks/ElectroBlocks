import Blockly from "blockly";
import type { Block } from "blockly";

Blockly["Arduino"]["ir_remote_setup"] = function (block: Block) {
  const pin = block.getFieldValue("PIN") || "2";
  Blockly["Arduino"].libraries_[
    "define_ir_remote"
  ] = `#include <IRremote.hpp> // Include the IRremote library for infrared communication
bool developer_ir_remote_found = false; // whether ir remote was pressed
int developer_ir_remote_command = -1; // the button pressed by the ir remote
`;

  Blockly["Arduino"].setupCode_[
    "setup_ir_remote"
  ] = `   IrReceiver.begin(${pin}, true); // \n`;
  Blockly["Arduino"].functionNames_[
    "ir_remote_scan"
  ] = `void irRemoteLoopScan() {
  if (!IrReceiver.decode()) {
    developer_ir_remote_found = false;
    developer_ir_remote_command = -1;
    IrReceiver.resume();
    return;
  }

  // Short-circuit noisy/overflow frames
  if (IrReceiver.decodedIRData.flags & IRDATA_FLAGS_WAS_OVERFLOW) {
    // Too long/garbled signal, skip
    IrReceiver.resume();
    developer_ir_remote_found = false;
    developer_ir_remote_command = -1;
    return;
  }

  // Ignore repeat frames (user holding the button)
  if (IrReceiver.decodedIRData.flags & IRDATA_FLAGS_IS_REPEAT) {
    IrReceiver.resume();
    developer_ir_remote_found = false;
    developer_ir_remote_command = -1;
    return;
  }

  developer_ir_remote_found = true;
  developer_ir_remote_command = IrReceiver.decodedIRData.command;
  IrReceiver.resume();
}`;

  return "";
};

Blockly["Arduino"]["ir_remote_has_code_receive"] = function () {
  return ["developer_ir_remote_found", Blockly["Arduino"].ORDER_ATOMIC];
};

Blockly["Arduino"]["ir_remote_get_code"] = function () {
  return ["developer_ir_remote_command", Blockly["Arduino"].ORDER_ATOMIC];
};

Blockly["Python"]["ir_remote_setup"] = function (block: Block) {
  const pin = block.getFieldValue("PIN") || "2";
  Blockly["Python"].setupCode_[
    "ir"
  ] = `eb.config_ir_remote(${pin}) # IR Remote Config\n`;

  return "";
};

Blockly["Python"]["ir_remote_has_code_receive"] = function (block: Block) {
  return ["eb.ir_remote_has_sensed_code()", Blockly["Python"].ORDER_ATOMIC];
};

Blockly["Python"]["ir_remote_get_code"] = function (block: Block) {
  return ["eb.ir_remote_get_code()", Blockly["Python"].ORDER_ATOMIC];
};
