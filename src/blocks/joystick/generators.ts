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

    int xRaw = analogRead(X_PIN);
    int yRaw = analogRead(Y_PIN);
    bool btnPressed = (digitalRead(SW_PIN) == LOW); // LOW means pressed

    // 2. Center the values (-512 to 512)
    int x = xRaw - 512;
    int y = yRaw - 512;

    // 3. Check if Engaged (Deadzone check)
    // If the stick is moved more than 100 units from center
    bool isEngaged = (abs(x) > 100 || abs(y) > 100);

    // 4. Calculate 360 Degree Angle
    float radians = atan2(y, x);
    float degrees = radians * (180.0 / PI);
    
    // Convert -180/180 to a clean 0-360
    if (degrees < 0) degrees += 360;

  internal_variable_degrees = isEngaged ? degrees : 0;
  internal_variable_isJoyStickEngaged = isEngaged;
  internal_variable_isJoystickButtonPressed = btnPressed;
  
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
