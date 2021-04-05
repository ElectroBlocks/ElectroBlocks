import Blockly from "blockly";

Blockly["Arduino"]["joystick_setup"] = function (block) {
  var dropdown_pin_x = block.getFieldValue("PIN_X");
  var dropdown_pin_y = block.getFieldValue("PIN_Y");
  var dropdown_pin_button = block.getFieldValue("PIN_BUTTON");
  var dropdown_loop = block.getFieldValue("LOOP");
  var checkbox_active = block.getFieldValue("ACTIVE") == "TRUE";
  var angle_degree = block.getFieldValue("DEGREE");
  var checkbox_button_pressed = block.getFieldValue("BUTTON_PRESSED") == "TRUE";
  // TODO: Assemble JavaScript into code variable.
  var code = "...;\n";
  return code;
};

Blockly["Arduino"]["joystick_angle"] = function (block) {
  // TODO: Assemble JavaScript into code variable.

  return "";
};

Blockly["Arduino"]["joystick_button"] = function (block) {
  // TODO: Assemble JavaScript into code variable.

  return "";
};

Blockly["Arduino"]["joystick_engaged"] = function (block) {
  // TODO: Assemble JavaScript into code variable.

  return "";
};
