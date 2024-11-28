import Blockly from "blockly";
import type { Block } from "blockly";

Blockly["Arduino"]["thermistor_setup"] = function (block: Block) {
  const pin = block.getFieldValue("PIN");
  const thermistorResistance = block.getFieldValue("THERMISTOR_RESISTANCE");
  const externalResistor = block.getFieldValue("NONIMAL_RESISTANCE");
  const defaultTemp = block.getFieldValue("DEFAULT_TEMP");
  const bValue = block.getFieldValue("B_VALUE");

  Blockly["Arduino"].libraries_["include_motor_library"] = `
#include <Thermistor.h> // Include the Thermistor library
#include <NTC_Thermistor.h> // Include the NTC Thermistor library

#define SENSOR_PIN             ${pin} // Define analog pin for the thermistor
#define REFERENCE_RESISTANCE   ${externalResistor} // Reference resistance value in ohms.
#define NOMINAL_RESISTANCE     ${thermistorResistance} // Nominal resistance of the thermistor at defined/given temp.
#define NOMINAL_TEMPERATURE    ${defaultTemp} // Nominal temperature in °C
#define B_VALUE                ${bValue}  // Thermistor's B-value (a constant that depends on the thermistor)


Thermistor* thermistor; // Declare a pointer to a Thermistor object
`;

  Blockly["Arduino"].setupCode_[
    "thermistor_setup_" + pin
  ] = `    // Initialize the NTC thermistor with specified parameters
   thermistor = new NTC_Thermistor(
      SENSOR_PIN,
      REFERENCE_RESISTANCE,
      NOMINAL_RESISTANCE,
      NOMINAL_TEMPERATURE,
      B_VALUE
   );\n`;
  return "";
};

Blockly["Arduino"]["thermistor_read"] = function (block: Block) {
  return ["thermistor->readCelsius()", Blockly["Arduino"].ORDER_ATOMIC];
};
