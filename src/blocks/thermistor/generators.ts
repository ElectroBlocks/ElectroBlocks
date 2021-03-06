import Blockly from "blockly";
import type { Block } from "blockly";

Blockly["Arduino"]["thermistor_setup"] = function (block: Block) {
  const pin = block.getFieldValue("PIN");
  const thermistorResistance = block.getFieldValue("THERMISTOR_RESISTANCE");
  const externalResistor = block.getFieldValue("NONIMAL_RESISTANCE");
  const defaultTemp = block.getFieldValue("DEFAULT_TEMP");
  const bValue = block.getFieldValue("B_VALUE");

  Blockly["Arduino"].libraries_["include_motor_library"] = `
#include <Thermistor.h>
#include <NTC_Thermistor.h>

#define SENSOR_PIN             ${pin}
#define REFERENCE_RESISTANCE   ${externalResistor}
#define NOMINAL_RESISTANCE     ${thermistorResistance}
#define NOMINAL_TEMPERATURE    ${defaultTemp}
#define B_VALUE                ${bValue}

Thermistor* thermistor;
`;

  Blockly["Arduino"].setupCode_[
    "thermistor_setup_" + pin
  ] = `\tthermistor = new NTC_Thermistor(
        SENSOR_PIN,
        REFERENCE_RESISTANCE,
        NOMINAL_RESISTANCE,
        NOMINAL_TEMPERATURE,
        B_VALUE
      );
      
      `;
  return "";
};

Blockly["Arduino"]["thermistor_read"] = function (block: Block) {
  return ["thermistor->readCelsius()", Blockly["Arduino"].ORDER_ATOMIC];
};
