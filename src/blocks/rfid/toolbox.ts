import { COLOR_THEME } from "../../core/blockly/constants/colors";
import { virtualCircuitComment } from "../comment-text";

export default `
<category name="RFID" colour="${COLOR_THEME.SENSOR}" >
           <block type="rfid_setup">
            <comment pinned="false" h="150" w="460">This block setups the RFID sensor and tells the Arduino which pin it should use to transmit RFID data.${virtualCircuitComment}</comment>
               <field name="PIN_TX">6</field>
           </block>
           <block type="rfid_card">
           <comment pinned="false" h="60" w="460">Returns the card number (text data) of the RFID chip.</comment>
           </block>
           <block type="rfid_tag">
                <comment pinned="false" h="60" w="460">Returns the tag of the RFID chip.</comment>
           </block>
           <block type="rfid_scan">
                <comment pinned="false" h="80" w="460">Scans for a new RFID card. Returns true if a new RFID chip is found.</comment>
           </block>
       </category>
`;
