import Blockly from "blockly";

Blockly["Arduino"]["joystick_setup"] = function (block) {
  var dropdown_pin_x = block.getFieldValue("PIN_X");
  var dropdown_pin_y = block.getFieldValue("PIN_Y");
  var dropdown_pin_button = block.getFieldValue("PIN_BUTTON");
  Blockly["Arduino"].libraries_["joystick"] = `
#include <math.h>

#define Y_PIN ${dropdown_pin_y}  
#define X_PIN ${dropdown_pin_x} 
#define SW_PIN ${dropdown_pin_button}

boolean internal_variable_isJoystickButtonPressed = false;
boolean internal_variable_isJoyStickEngaged = false;
int internal_variable_degrees = 0;
`;
  Blockly["Arduino"].functionNames_["joystick"] = `void setJoyStickValues() {
  // https://medium.com/@melaniechow/using-a-joystick-sensor-on-an-arduino-3498d7399464
  // This function was inspired by this Article
  int y = (analogRead(Y_PIN) * 4.9);   
  delay(50); // small pause needed between reading
  int x = (analogRead(X_PIN) * 4.9 );  
  delay(50);  
  
  x = (x - 2457);
  y = (y - 2541);
  
  double val = atan2(y, x) * 180/3.14159265358979; 
  
  if (val < 0) {
    val += 360;
  }
  
  //convert to a double
  double new_x = x / 100.0;
  double new_y = y / 100.0;
  double distance = sqrt((new_x * new_x) + (new_y * new_y));

  internal_variable_degrees = distance > 15 ? val : 0;
  internal_variable_isJoyStickEngaged = distance > 15;
  internal_variable_isJoystickButtonPressed = digitalRead(SW_PIN) == LOW;
  
}`;
  Blockly["Arduino"].setupCode_["joystick"] = `
    pinMode(SW_PIN, INPUT);
    pinMode(Y_PIN, INPUT);
    pinMode(X_PIN, INPUT);
    digitalWrite(SW_PIN, HIGH);
  `;

  return "";
};

Blockly["Arduino"]["joystick_angle"] = function (block) {
  return ["internal_variable_degrees", Blockly["Arduino"].ORDER_ATOMIC];
};
Blockly["Arduino"]["joystick_button"] = function (block) {
  return [
    "internal_variable_isJoystickButtonPressed",
    Blockly["Arduino"].ORDER_ATOMIC,
  ];
};

Blockly["Arduino"]["joystick_engaged"] = function (block) {
  return [
    "internal_variable_isJoyStickEngaged",
    Blockly["Arduino"].ORDER_ATOMIC,
  ];
};

Blockly.Python["joystick_setup"] = function (block: Block) {
  const pinX = block.getFieldValue("PIN_X");
  const pinY = block.getFieldValue("PIN_Y");
  const pinButton = block.getFieldValue("PIN_BUTTON");

  Blockly.Python.definitions_ = Blockly.Python.definitions_ || {};
  Blockly.Python.setups_ = Blockly.Python.setups_ || {};

  Blockly.Python.definitions_["import_pyfirmata"] = `
from pyfirmata import Arduino, util
import math
import time
board = Arduino('/dev/ttyACM0')  # Update port if needed
it = util.Iterator(board)
it.start()
`;

  Blockly.Python.setups_["joystick_pin_modes"] = `
joystick_button = board.digital[${pinButton}]
joystick_button.mode = util.INPUT
x_pin = board.analog[${pinX.replace("A", "")}]
y_pin = board.analog[${pinY.replace("A", "")}]
x_pin.enable_reporting()
y_pin.enable_reporting()
`;

  Blockly.Python.definitions_["joystick_variables"] = `
internal_variable_isJoystickButtonPressed = False
internal_variable_isJoyStickEngaged = False
internal_variable_degrees = 0
`;

  Blockly.Python.definitions_["joystick_function"] = `
def set_joystick_values():
    global internal_variable_isJoystickButtonPressed
    global internal_variable_isJoyStickEngaged
    global internal_variable_degrees

    x_raw = x_pin.read()
    y_raw = y_pin.read()

    if x_raw is None or y_raw is None:
        return

    x = (x_raw * 5.0 * 1000) - 2457
    y = (y_raw * 5.0 * 1000) - 2541

    angle_rad = math.atan2(y, x)
    angle_deg = math.degrees(angle_rad)
    if angle_deg < 0:
        angle_deg += 360

    new_x = x / 100.0
    new_y = y / 100.0
    distance = math.sqrt(new_x ** 2 + new_y ** 2)

    internal_variable_degrees = angle_deg if distance > 15 else 0
    internal_variable_isJoyStickEngaged = distance > 15

    btn_val = joystick_button.read()
    internal_variable_isJoystickButtonPressed = btn_val == 0
`;

    return `
while True:
    set_joystick_values()
    time.sleep(0.05)
`;
};

Blockly.Python["joystick_angle"] = function (block: Block) {
  return ["internal_variable_degrees", Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python["joystick_button"] = function (block: Block) {
  return ["internal_variable_isJoystickButtonPressed", Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python["joystick_engaged"] = function (block: Block) {
  return ["internal_variable_isJoyStickEngaged", Blockly.Python.ORDER_ATOMIC];
};

