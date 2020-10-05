import { COLOR_THEME } from "../../core/blockly/constants/colors";

export default `
<category name="Write Pins" colour="${COLOR_THEME.COMPONENTS}">
   <block type="digital_write"></block>

       <block type="analog_write">
       <value name="WRITE_VALUE">
                   <block type="math_number">
                       <field name="NUM">150</field>
                   </block>
               </value>
       </block>
   </category>
`;
