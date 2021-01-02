import { COLOR_THEME } from "../../core/blockly/constants/colors";

export default `
<category name="Servo" colour="${COLOR_THEME.COMPONENTS}">

   <block type="rotate_servo">
    <comment pinned="false" h="180" w="460">This block sets the angle and pin of a servo.  A servo is a motor that allows you to control how far it rotates.  The pin you are This block sets the angle and pin for a servo.  A servo is a motor that allows you to control how far it rotates.  The pin you are specifying is the data pin that the Arduino will use to control the servo's angle.</comment>
   <value name="DEGREE">
   <block type="math_number">
       <field name="NUM">50</field>
   </block>
   </value>
   </block>
   </category>
`;
