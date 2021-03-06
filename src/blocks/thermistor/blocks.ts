import Blockly from "blockly";
import { COLOR_THEME } from "../../core/blockly/constants/colors";
import loopTimes from "../../core/blockly/helpers/looptimes";
import { selectBoardBlockly } from "../../core/microcontroller/selectBoard";

Blockly.Blocks["thermistor_setup"] = {
  init: function () {
    this.appendDummyInput()
      .appendField(
        new Blockly.FieldImage("./blocks/thermistor/thermistor.svg", 15, 15)
      )
      .appendField("Thermistor Setup");
    this.appendDummyInput()
      .appendField("Analog Pin #")
      .appendField(
        new Blockly.FieldDropdown(() => selectBoardBlockly().analogPins),
        "PIN"
      );

    this.appendDummyInput()
      .appendField("Default Temp °C: ")
      .appendField(new Blockly.FieldNumber(25, -50, 50), "DEFAULT_TEMP");

    this.appendDummyInput()
      .appendField("Thermistor ohms: ")
      .appendField(
        new Blockly.FieldNumber(10000, 1000, 1000000, 1000),
        "THERMISTOR_RESISTANCE"
      );

    this.appendDummyInput()
      .appendField("Resistors ohms: ")
      .appendField(
        new Blockly.FieldNumber(10000, 1000, 1000000, 1000),
        "NONIMAL_RESISTANCE"
      );

    this.appendDummyInput()
      .appendField("B Value")
      .appendField(new Blockly.FieldNumber(3950, 1000, 10000, 1), "B_VALUE");
    this.appendDummyInput().appendField("------------------------------");
    this.appendDummyInput()
      .appendField("Loop")
      .appendField(new Blockly.FieldDropdown(() => loopTimes()), "LOOP");
    this.appendDummyInput()
      .appendField("Temperature in °C")
      .appendField(new Blockly.FieldNumber(23, -500, 500), "TEMP");
    this.setColour(COLOR_THEME.SENSOR);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["thermistor_read"] = {
  init: function () {
    this.appendDummyInput()
      .appendField(
        new Blockly.FieldImage("./blocks/thermistor/thermistor.svg", 15, 15)
      )
      .appendField("Read Temperature");
    this.setOutput(true, "Number");
    this.setColour(COLOR_THEME.SENSOR);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};
