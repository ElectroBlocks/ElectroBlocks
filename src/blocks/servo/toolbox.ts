import { COLOR_THEME } from "../../core/blockly/constants/colors";

export default `
<category name="Servo" colour="${COLOR_THEME.COMPONENTS}">

   <block type="rotate_servo">
    <comment pinned="false" h="180" w="460">Rotate servo position for defined degrees.</comment>
   <value name="DEGREE">
   <block type="math_number">
       <field name="NUM">50</field>
   </block>
   </value>
   </block>
   </category>
`;
