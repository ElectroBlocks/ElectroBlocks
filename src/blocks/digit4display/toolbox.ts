import { COLOR_THEME } from "../../core/blockly/constants/colors";

export default `<category name="Digit Display" colour="${COLOR_THEME.COMPONENTS}">
       <block type="digital_display_setup">
            <comment pinned="false" h="150" w="460">Digit display will display number and letters.  Because there a only 7 led lines some characters might be limited</comment>
           <field name="CLK_PIN">10</field>
    <field name="DIO_PIN">11</field>

       </block>
       <block type="digital_display_set">
            <comment pinned="false" h="70" w="460">Sets the text and turns the colons on and off.</comment>
            <value name="TEXT">
                <block type="text">
                    <field name="TEXT">Noob</field>
                </block>
            </value>
       </block>
   </category>`;
