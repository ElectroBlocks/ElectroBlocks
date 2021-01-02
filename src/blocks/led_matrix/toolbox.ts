import { COLOR_THEME } from "../../core/blockly/constants/colors";

export default `<category colour="${COLOR_THEME.COMPONENTS}" name="Led Matrix">
     <block type="led_matrix_setup">
    <comment pinned="false" h="60" w="460">This block sets up the let matrix.</comment>
                           <field name="PIN_DATA">10</field>
                           <field name="PIN_CLK">12</field>
                           <field name="PIN_CS">11</field>

     </block>

     <block type="led_matrix_make_draw">
        <comment pinned="false" h="80" w="460">Check the checkboxes to draw a pattern on the led matrix.</comment>
     </block>
   <block type="led_matrix_turn_one_on_off">
   <comment pinned="false" h="150" w="460" >Turns or off one led on the led matrix.  

The higher the number for the column, the more right the led will be.  The higher the number for the row, the lower the will be.</comment>
   <value name="ROW">
                   <block type="math_number">
                       <field name="NUM">1</field>
                   </block>
               </value>
               <value name="COLUMN">
                   <block type="math_number">
                       <field name="NUM">1</field>
                   </block>
               </value>
   </block>
   </category>`;
