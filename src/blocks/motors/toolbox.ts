import { COLOR_THEME } from "../../core/blockly/constants/colors";

export default `
<category name="Motor" colour="${COLOR_THEME.COMPONENTS}">
   <block type="motor_setup">
       <comment pinned="false" h="220" w="460">This setups up the pins to control the L298N chip and the number of motors you want to control.</comment>
    <field name="PIN_EN1">9</field>
    <field name="PIN_IN1">8</field>
    <field name="PIN_IN2">7</field>
    <field name="PIN_IN3">5</field>
    <field name="PIN_IN4">4</field>
    <field name="PIN_EN2">3</field>

   </block>

   <block type="move_motor">
    <comment pinned="false" h="220" w="460">Moves the motor and allow you to control the speed and direction.</comment>
   <value name="SPEED">
                   <block type="math_number">
                       <field name="NUM">50</field>
                   </block>
               </value>
               <value name="MOTOR">
                   <block type="math_number">
                       <field name="NUM">1</field>
                   </block>
               </value>
   </block>
      <block type="stop_motor">
          <comment pinned="false" h="220" w="460">Stop the motor from spinning.</comment>

   </block>

   </category>
`;
