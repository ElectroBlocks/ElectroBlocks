import * as Blockly from "blockly/core";
import BlocklyV2 from "blockly";

export class RedCheckboxThatIsLong extends BlocklyV2.Field {
  init(): void {
    super.init();
    this.drawRect();
  }
  /**
   * Create a field border rect element. Not to be overridden by subclasses.
   * Instead modify the result of the function inside initView, or create a
   * separate function to call.
   */
  protected drawRect() {
    const box = Blockly.utils.dom.createSvgElement(
      Blockly.utils.Svg.RECT,
      {
        rx: 0,
        ry: 0,
        x: 0,
        y: 0,
        height: 10,
        width: 100,
        class: "noah",
      },
      this.fieldGroup_
    );
    box.style.fill = "#aa0000";
    box.style.opacity = "1";
    box.style.fillOpacity = "1";
    (window as any).box = box;
    this.borderRect_.style.display = "none";
  }

  protected createTextElement_() {}
}
