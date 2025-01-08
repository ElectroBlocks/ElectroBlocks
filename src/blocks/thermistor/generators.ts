import Blockly from "blockly";
import { Block } from "blockly";
import { stepSerialBegin } from "../message/generators";

Blockly["Arduino"]["thermistor_setup"] = function (block: Block) {
  const pin = block.getFieldValue("PIN");

  Blockly["Arduino"].libraries_["include_motor_library"] = `
#define THERMISTOR_PIN  ${pin} // Define analog pin for the thermistor
#define BETA            3950 // The beta value of the thermistor
#define RESISTANCE      10 // The value of the pull-down resistor (in ohms)`;
  stepSerialBegin();

  Blockly["Arduino"].functionNames_[
    "readThermistor"
  ] = `float readThermistor(String returnUnit) {
  // Read the thermistor value from the analog pin
  long a = analogRead(THERMISTOR_PIN);

  // Calculate the temperature using the thermistor's equation
  float tempC = BETA / (log((1025.0 * RESISTANCE / a - RESISTANCE) / RESISTANCE) + BETA / 298.0) - 273.0;

  // Convert Celsius to Fahrenheit (optional)
  float tempF = (tempC * 1.8) + 32.0;

  // Print the Celsius temperature
  Serial.print("TempC: ");
  Serial.print(tempC); // Print Celsius temperature
  Serial.println(" °C"); // Print the unit

  // Print the Fahrenheit temperature (optional)
  Serial.print("TempF: ");
  Serial.print(tempF); // Print Fahrenheit temperature
  Serial.println(" °F"); // Print the unit

  delay(200); // Wait for 200 milliseconds before the next reading

  return returnUnit == "C" ? tempC : tempF; // Return the temperature based on the unit.
}`;

  Blockly["Arduino"].setupCode_[
    "thermistor_setup_" + pin
  ] = `   pinMode(${pin}, INPUT); // Configures the thermistor pin as an input \n`;
  return "";
};

Blockly["Arduino"]["thermistor_read"] = function (block: Block) {
  var unit = block.getFieldValue("UNIT");
  return [`readThermistor("${unit}")`, Blockly["Arduino"].ORDER_ATOMIC];
};
