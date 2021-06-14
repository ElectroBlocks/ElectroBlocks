import Blockly from "blockly";
import iro from "@jaames/iro";

Blockly.FieldColorPicker = function (
  opt_value,
  opt_validator,
  opt_textEdit = false
) {
  /**
   * The default value for this field (current date).
   * @type {*}
   * @protected
   */
  Blockly.FieldColorPicker.prototype.DEFAULT_VALUE = "#FF00FF";

  Blockly.FieldColorPicker.superClass_.constructor.call(
    this,
    opt_value,
    opt_validator
  );

  /**
   * Whether text editing is enabled on this field.
   * @type {boolean}
   * @private
   */
  this.textEditEnabled_ = false;
};
Blockly.FieldColorPicker.fromJson = function (options) {
  var text = Blockly.utils.replaceMessageReferences(options["text"]);
  return new Blockly.FieldColorPicker(text, undefined, options);
};

Blockly.utils.object.inherits(Blockly.FieldColorPicker, Blockly.FieldTextInput);
Blockly.fieldRegistry.register("field_color_picker", Blockly.FieldColorPicker);

/**
 * Copied form the color field
 */
Blockly.FieldColorPicker.prototype.initView = function () {
  this.size_ = new Blockly.utils.Size(
    this.getConstants().FIELD_COLOUR_DEFAULT_WIDTH,
    this.getConstants().FIELD_COLOUR_DEFAULT_HEIGHT
  );
  if (!this.getConstants().FIELD_COLOUR_FULL_BLOCK) {
    this.createBorderRect_();
    this.borderRect_.style["fillOpacity"] = "1";
  } else {
    this.clickTarget_ = this.sourceBlock_.getSvgRoot();
  }
};

/**
 * Show the inline free-text editor on top of the text.
 * @param {Event=} _opt_e Optional mouse event that triggered the field to open,
 *     or undefined if triggered programmatically.
 * @param {boolean=} opt_quietInput True if editor should be created without
 *     focus.  Defaults to false.
 * @protected
 */
Blockly.FieldColorPicker.prototype.showEditor_ = function (opt_e) {
  const editor = document.createElement("div");
  editor.id = "color-picker";
  Blockly.DropDownDiv.getContentDiv().appendChild(editor);
  Blockly.DropDownDiv.showPositionedByField(this, () => editor.remove());
  var colorPicker = new iro.ColorPicker("#color-picker", {
    width: 150,
    height: 150,
    color: this.getValue(),
  });
  colorPicker.on("color:change", (color) => {
    this.setEditorValue_(color.hexString);
  });
};

/**
 * Copied from colour field
 * Update the value of this colour field, and update the displayed colour.
 * @param {*} newValue The value to be saved. The default validator guarantees
 * that this is a colour in '#rrggbb' format.
 * @protected
 */
Blockly.FieldColorPicker.prototype.doValueUpdate_ = function (newValue) {
  this.value_ = newValue;
  if (this.borderRect_) {
    this.borderRect_.style.fill = /** @type {string} */ (newValue);
  } else if (this.sourceBlock_ && this.sourceBlock_.rendered) {
    this.sourceBlock_.pathObject.svgPath.setAttribute("fill", newValue);
    this.sourceBlock_.pathObject.svgPath.setAttribute("stroke", "#fff");
  }
};

/**
 * Copied from colour field
 * @override
 */
Blockly.FieldColorPicker.prototype.applyColour = function () {
  if (!this.getConstants().FIELD_COLOUR_FULL_BLOCK) {
    if (this.borderRect_) {
      this.borderRect_.style.fill = /** @type {string} */ (this.getValue());
    }
  } else {
    this.sourceBlock_.pathObject.svgPath.setAttribute("fill", this.getValue());
    this.sourceBlock_.pathObject.svgPath.setAttribute("stroke", "#fff");
  }
};
/**
 * Set the html input value and the field's internal value. The difference
 * between this and ``setValue`` is that this also updates the html input
 * value whilst editing.
 * @param {*} newValue New value.
 * @protected
 */
Blockly.FieldColorPicker.prototype.setEditorValue_ = function (newValue) {
  // Over riding this from the text field because it was marking the field dirty and causing things to resize
  this.setValue(newValue);
};

/**
 * Mouse cursor style when over the hotspot that initiates the editor.
 */
Blockly.FieldColorPicker.prototype.CURSOR = "default";

/**
 * Used to tell if the field needs to be rendered the next time the block is
 * rendered. Colour fields are statically sized, and only need to be
 * rendered at initialization.
 * @type {boolean}
 * @protected
 */
Blockly.FieldColorPicker.prototype.isDirty_ = false;

/**
 * Serializable fields are saved by the XML renderer, non-serializable fields
 * are not. Editable fields should also be serializable.
 * @type {boolean}
 */
Blockly.FieldColorPicker.prototype.SERIALIZABLE = true;

console.log("this ran");
