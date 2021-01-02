import { COLOR_THEME } from "../../core/blockly/constants/colors";

export default `
<category name="Motor" colour="${COLOR_THEME.COMPONENTS}">
   <block type="move_motor">
    <comment pinned="false" h="220" w="460">The motor number is on your motor shield.  The speed determines how much electricity will flow through your motor.  Depending on how big your motor is will decide on your actual speed.
    
Right now, motor move only works with Adafruit motor shield version 1.  We will be adding version 2 and other motor shield libraries soon.</comment>

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
