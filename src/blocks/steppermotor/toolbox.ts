import { COLOR_THEME } from "../../core/blockly/constants/colors";

export default `
<category name="Stepper Motors" colour="${COLOR_THEME.COMPONENTS}" >
       
       <block type="stepper_motor_setup">
             <field name="PIN_1">11</field>
             <field name="PIN_2">10</field>
             <field name="PIN_3">9</field>
             <field name="PIN_4">8</field>
             <field name="SPEED">10</field>
             <field name="TOTAL_STEPS">200</field>

        <comment pinned="false" h="140" w="460">This block will setup the stepper motor.  A stepper motor allows to control it rotational position.
        
Use the number of steps to control how big each step will be.  The smaller the number the bigger the step.   </comment>
       </block>

       <block type="stepper_motor_move">
       <value name="STEPS">
                   <block type="math_number">
                       <field name="NUM">3</field>
                   </block>
               </value>
        <comment pinned="false" h="80" w="460">This blocks controls many steps the the stepper motor will move</comment>
       </block>
       </category>

`;
