import { COLOR_THEME } from "../../core/blockly/constants/colors";

export default `<category name="RGB LED" colour="${COLOR_THEME.COMPONENTS}">
   
   <block type="rgb_led_setup">
                           <field name="PIN_RED">6</field>
                         <field name="PIN_GREEN">5</field>
                         <field name="PIN_BLUE">3</field>
 </block>

   <block type="set_color_led">
   <value name="COLOUR">
                   <block type="colour_picker">
                   </block>
   </value>
   </block>
   </category>`;
