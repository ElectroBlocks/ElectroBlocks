import { COLOR_THEME } from "../../core/blockly/constants/colors";

export default `
<category name="Motor" colour="${COLOR_THEME.COMPONENTS}">
   <block type="move_motor">
   <value name="SPEED">
                   <block type="math_number">
                       <field name="NUM">250</field>
                   </block>
               </value>
               <value name="MOTOR">
                   <block type="math_number">
                       <field name="NUM">1</field>
                   </block>
               </value>
   </block>
   </category>
`;
