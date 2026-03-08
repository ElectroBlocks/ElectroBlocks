import Blockly from "blockly";
import type { Block } from "blockly";

Blockly["Arduino"]["digital_read_setup"] = function (block: Block) {
  const pin = block.getFieldValue("PIN");
  const sensorType = block.getFieldValue("TYPE");

  Blockly["Arduino"].information_["digital_read" + pin] = { sensorType };
  Blockly["Arduino"].setupCode_[
    "digital_read" + pin
  ] = `   pinMode(${pin}, INPUT); // Configures defined pin as an input \n`;

  return "";
};

Blockly["Python"]["digital_read_setup"] = function (block: Block) {
  const pin = block.getFieldValue("PIN");
  const sensorType = block.getFieldValue("TYPE");
  Blockly["Arduino"].information_["digital_read" + pin] = { sensorType };
  Blockly["Python"].setupCode_[
    "config_digital_read_" + pin
  ] = `eb.config_digital_read(${pin}) # Set up digital read for pin ${pin}.\n`;

  return "";
};

Blockly["Python"]["digital_read"] = function (block: Block) {
  const pin = block.getFieldValue("PIN");
  const sensorType =
    Blockly["Arduino"].information_["digital_read" + pin]?.sensorType ??
    "SENSOR";
  if (sensorType == "IR_SENSOR") {
    return [`not eb.digital_read(${pin})`, Blockly["Python"].ORDER_ATOMIC];
  }
  return [`eb.digital_read(${pin})`, Blockly["Python"].ORDER_ATOMIC];
};

Blockly["Arduino"]["digital_read"] = function (block: Block) {
  const pin = block.getFieldValue("PIN");
  const sensorType =
    Blockly["Arduino"].information_["digital_read" + pin]?.sensorType ??
    "SENSOR";
  console.log(sensorType, 'sensorType');
  if (sensorType == "IR_SENSOR") {
    return ["!digitalRead(" + pin + ")", Blockly["Arduino"].ORDER_ATOMIC];
  }
  return ["digitalRead(" + pin + ")", Blockly["Arduino"].ORDER_ATOMIC];
};
