import { COLOR_THEME } from "../../core/blockly/constants/colors";

export default `
<category name="Motor" colour="${COLOR_THEME.COMPONENTS}">
   <block type="move_motor">
    <comment pinned="false" h="190" w="460">The motor number is on your motor shield.  The speed determines how much electricity will flow through your motor.  Depending on how big your motor is will decide on your actual speed.
    
Right now, motor move only works with Adafruit motor shield version 1.  We will be adding version 2 and other motor shield libraries soon.</comment>

   <value name="SPEED">
                   <block type="math_number">
                       <field name="NUM">50</field>
                   </block>
               </value>
             
   </block>

     <block type="setup_motor">
    <comment pinned="false" h="240" w="460">This block sets up the motor by configuring the MOTOR, EN1, and EN2 pins. This configuration is necessary for proper motor operation.</comment>
    <value name="MOTOR">
      <block type="math_number">
        <field name="NUM">1</field>
      </block>
    </value>
    <value name="EN1">
      <block type="math_number">
        <field name="NUM">3</field>
      </block>
    </value>
    <value name="EN2">
      <block type="math_number">
        <field name="NUM">3</field>
      </block>
    </value>
  </block>
   </category>
`;
