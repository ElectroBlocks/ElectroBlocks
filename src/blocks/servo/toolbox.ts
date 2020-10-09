import { COLOR_THEME } from "../../core/blockly/constants/colors";

export default `
<category name="Servo" colour="${COLOR_THEME.COMPONENTS}">

   <block type="rotate_servo">
   <value name="DEGREE">
   <block type="math_number">
       <field name="NUM">50</field>
   </block>
   </value>
   </block>
   </category>
`;
