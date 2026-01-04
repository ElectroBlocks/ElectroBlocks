import Blockly from "blockly";
import { Block } from "blockly";

Blockly["Python"]["temp_setup"] = function (block: Block) {
  const pin = block.getFieldValue("PIN");
  Blockly["Python"].setupCode_[
    "temp_dht"
  ] = `eb.config_dht_temp(${pin}, '${block.getFieldValue("TYPE")}')\n`;
  return "";
};
Blockly["Arduino"]["temp_setup"] = function (block: Block) {
  Blockly["Arduino"].libraries_[
    "temp_setup"
  ] = `#define DHTPIN ${block.getFieldValue(
    "PIN"
  )} // Define pin  for the DHT sensor data
#define DHTTYPE ${block.getFieldValue("TYPE")} // Define the type of DHT sensor.
#include <DHT.h>; // Include the DHT library for temperature and humidity sensor
DHT dht(DHTPIN, DHTTYPE); // Initialize the DHT sensor using the defined pin and type`;
  Blockly["Arduino"].setupCode_[
    "temp_setup"
  ] = `   dht.begin(); // Initialize the DHT sensor
`;

  return "";
};

Blockly["Arduino"]["temp_get_temp"] = function () {
  return ["(double)dht.readTemperature()", Blockly["Arduino"].ORDER_ATOMIC];
};

Blockly["Arduino"]["temp_get_humidity"] = function () {
  return ["(double)dht.readHumidity()", Blockly["Arduino"].ORDER_ATOMIC];
};

Blockly["Python"]["temp_get_temp"] = function () {
  return ["eb.dht_temp_celcius()", Blockly["Python"].ORDER_ATOMIC];
};

Blockly["Python"]["temp_get_humidity"] = function () {
  return ["eb.dht_temp_humidity()", Blockly["Python"].ORDER_ATOMIC];
};
