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

void setJoyStickValues() {

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
  
}

  `;

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
