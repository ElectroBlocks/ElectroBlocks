import Blockly from "blockly";
import type { Block } from "blockly";

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

Blockly["Python"]["temp_setup"] = function (block) {
  const pin = block.getFieldValue("PIN");     // e.g., "4"
  const type = block.getFieldValue("TYPE");   // e.g., "DHT11" or "DHT22"

  // Include import and setup as Python definitions
  Blockly["Python"].definitions_["import_dht"] = "import Adafruit_DHT";

  // Set sensor type
  Blockly["Python"].definitions_["define_dht_type"] =
    `dht_sensor = Adafruit_DHT.${type}`;

  // Set GPIO pin
  Blockly["Python"].definitions_["define_dht_pin"] = `dht_pin = ${pin}`;

  return ""; // No code in-line; just definitions
};
Blockly["Python"]["temp_get_temp"] = function () {
  const code = "Adafruit_DHT.read_retry(dht_sensor, dht_pin)[0]";
  return [code, Blockly["Python"].ORDER_ATOMIC];
};
Blockly["Python"]["temp_get_humidity"] = function () {
  const code = "Adafruit_DHT.read_retry(dht_sensor, dht_pin)[1]";
  return [code, Blockly["Python"].ORDER_ATOMIC];
};
