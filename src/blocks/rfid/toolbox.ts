import { COLOR_THEME } from "../../core/blockly/constants/colors";

export default `
<category name="RFID" colour="${COLOR_THEME.SENSOR}" >
           <block type="rfid_setup">
               <field name="PIN_TX">6</field>
           </block>
           <block type="rfid_card"></block>
           <block type="rfid_tag"></block>
           <block type="rfid_scan"></block>
       </category>
`;
