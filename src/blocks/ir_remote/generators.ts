import Blockly from "blockly";
import type { Block } from "blockly";

Blockly["Arduino"]["ir_remote_setup"] = function (block: Block) {
  const pin = block.getFieldValue("PIN") || "A1";
  Blockly["Arduino"].libraries_[
    "define_ir_remote"
  ] = `#include <IRremote.hpp> // Include the IRremote library for infrared communication
bool developer_ir_remote_found = false; // whether ir remote was pressed
int developer_ir_remote_command = -1; // the button pressed by the ir remote`;
  Blockly["Arduino"].functionNames_["irRemote"] = `void irRemoteLoopScan() {
  if (!IrReceiver.decode()) {
    developer_ir_remote_found = false;
    developer_ir_remote_command = -1;
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
  if (developer_ir_remote_command <= 0) {
    IrReceiver.resume();
    developer_ir_remote_found = false;
    developer_ir_remote_command = -1;
    return;
  }
  IrReceiver.resume();
}`;
  Blockly["Arduino"].setupCode_[
    "setup_ir_remote"
  ] = `   IrReceiver.begin(${pin}, true);    // Start the IR receiver\n`;
  return "";
};

Blockly["Arduino"]["ir_remote_has_code_receive"] = function () {
  return ["developer_ir_remote_found", Blockly["Arduino"].ORDER_ATOMIC];
};

Blockly["Arduino"]["ir_remote_get_code"] = function () {
  return [
    "String(developer_ir_remote_command, HEX)",
    Blockly["Arduino"].ORDER_ATOMIC,
  ];
};
