import { COLOR_THEME } from "../../core/blockly/constants/colors";

export default `
<category name="Color" colour="${COLOR_THEME.VALUES}">
<block type="color_picker_custom"></block>
<block type="colour_random"></block>
       <block type="colour_rgb">
         <comment pinned="false" h="70" w="460">This is used to create a custom color.  Google "RGB color picker" to find a custom color.</comment>

         <value name="RED">
           <block type="math_number">
             <field name="NUM">100</field>
           </block>
         </value>
         <value name="GREEN">
           <block type="math_number">
             <field name="NUM">50</field>
           </block>
         </value>
         <value name="BLUE">
           <block type="math_number">
             <field name="NUM">0</field>
           </block>
         </value>
       </block>
     </category>
`;
