import { COLOR_THEME } from "../../core/blockly/constants/colors";

export default `<category colour="${COLOR_THEME.COMPONENTS}" name="Led Matrix">
     <block type="led_matrix_setup">
                           <field name="PIN_DATA">10</field>
                           <field name="PIN_CLK">12</field>
                           <field name="PIN_CS">11</field>

     </block>

     <block type="led_matrix_make_draw"></block>
   <block type="led_matrix_turn_one_on_off">
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
