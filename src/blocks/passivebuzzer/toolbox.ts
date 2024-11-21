import { COLOR_THEME } from "../../core/blockly/constants/colors";

export default `
<category name="Passive Buzzer" colour="${COLOR_THEME.COMPONENTS}" >
       
       <block type="passive_buzzer_tone">
       <value name="TONE">
                   <block type="math_number">
                       <field name="NUM">123</field>
                   </block>
               </value>
                                            <field name="PIN">9</field>

        <comment pinned="false" h="60" w="460">This will set the passive buzzer to any tone you want.</comment>
       </block>

       <block type="passive_buzzer_note">
                             <field name="PIN">9</field>
       <field name="TONE">131</field>
        <comment pinned="false" h="60" w="460">This will set the passive buzzer to a note you want..</comment>
       </block>
              <block type="passive_buzzer_simple">
                             <field name="PIN">9</field>
</block>
       </category>
`;
