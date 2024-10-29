import Blockly, { type BlockSvg } from "blockly";

Blockly["Arduino"]["button_setup"] = function (block: BlockSvg) {
  const pin = block.getFieldValue("PIN");
  const usePullupResistor = block.getFieldValue("PULLUP_RESISTOR") == "TRUE";
  const inputType = usePullupResistor ? "INPUT_PULLUP" : "INPUT";
  if (Blockly["Arduino"].buttonType === undefined) {
    Blockly["Arduino"].buttonTypes = {
      [pin.toString()]: { usePullupResistor },
    };
  } else {
    Blockly["Arduino"].buttonTypes[pin] = { usePullupResistor };
  }
  Blockly["Arduino"].setupCode_[
    "btn_pin_" + pin
  ] = `\tpinMode("${pin}, ${inputType}); \n`;

  return "";
};

Blockly["Arduino"]["is_button_pressed"] = function (block: BlockSvg) {
  const pin = block.getFieldValue("PIN");
  const readType = Blockly["Arduino"].buttonTypes[pin].usePullupResistor
    ? "LOW"
    : "HIGH";
  return [
    `(digitalRead(${pin}) == ${readType})`,
    Blockly["Arduino"].ORDER_ATOMIC,
  ];
};

// This is a simulation only block
Blockly["Arduino"]["release_button"] = function (block: BlockSvg) {
  return "";
};
