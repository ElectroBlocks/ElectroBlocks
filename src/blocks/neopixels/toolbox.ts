import { COLOR_THEME } from "../../core/blockly/constants/colors";

export default `<category name="Led Light Strip" colour="${COLOR_THEME.COMPONENTS}">
       <block type="neo_pixel_setup">
             <field name="PIN">A0</field>
       </block>
       <block type="neo_pixel_set_color">
         <value name="POSITION">
           <block type="math_number">
             <field name="NUM">1</field>
           </block>
         </value>
         <value name="COLOR">
           <block type="colour_picker"> </block>
         </value>
       </block>
   </category>`;
