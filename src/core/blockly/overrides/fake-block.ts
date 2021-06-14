import Blockly from "blockly";

// This is prevent the coloring stuff from rendering
Blockly.FieldColour.prototype.doValueUpdate_ = function (newValue) {
  this.value_ = newValue;
};

class FieldColorPicker {
  constructor(color: string) {}
  public doValueUpdate_(newValue: string) {}
}

(Blockly as any).FieldColorPicker = FieldColorPicker;
