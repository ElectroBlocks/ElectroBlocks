import Blockly from "blockly";
import type { Block } from "blockly";

Blockly["Arduino"]["temp_setup"] = function (block: Block) {
  Blockly["Arduino"].libraries_[
    "temp_setup"
  ] = `#define DHTPIN ${block.getFieldValue("PIN")}
#define DHTTYPE ${block.getFieldValue("TYPE")}
#include <DHT.h>;
DHT dht(DHTPIN, DHTTYPE);`;
  Blockly["Arduino"].setupCode_["temp_setup"] = `dht.begin();

  `;

  return "";
};

Blockly["Arduino"]["temp_get_temp"] = function () {
  return ["(double)dht.readTemperature()", Blockly["Arduino"].ORDER_ATOMIC];
};

Blockly["Arduino"]["temp_get_humidity"] = function () {
  return ["(double)dht.readHumidity()", Blockly["Arduino"].ORDER_ATOMIC];
};
