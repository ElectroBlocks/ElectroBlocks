import { COLOR_THEME } from "../../core/blockly/constants/colors";

export default `<category name="Led" colour="${COLOR_THEME.COMPONENTS}">
   <block type="led"></block>

   <block type="led_fade">
   <value name="FADE">
                   <block type="math_number">
                       <field name="NUM">125</field>
                   </block>
               </value>
   </block>
</category>`;
