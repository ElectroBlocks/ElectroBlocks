import Blockly from "blockly";
import type { Block } from "blockly";

Blockly["Arduino"]["thermistor_setup"] = function (block: Block) {
  const pin = block.getFieldValue("PIN");
  Blockly["Arduino"].setupCode_["thermistor_setup_" + pin] =
    "\tpinMode(" + pin + ", INPUT); \n";

  Blockly["Arduino"].functionNames_[
    "thermistorCelsius"
  ] = `double thermistorCelsius() {
  int tempReading = analogRead(${pin});
  // This is OK
  double tempK = log(10000.0 * ((1024.0 / tempReading - 1)));
  tempK = 1 / (0.001129148 + (0.000234125 + (0.0000000876741 * tempK * tempK )) * tempK );       //  Temp Kelvin
  return tempK - 273.15;            // Convert Kelvin to Celcius
}`;

  return "";
};

Blockly["Arduino"]["thermistor_read"] = function (block: Block) {
  return ["thermistorCelsius()", Blockly["Arduino"].ORDER_ATOMIC];
};
