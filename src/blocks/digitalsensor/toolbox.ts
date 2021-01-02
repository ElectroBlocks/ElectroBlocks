import { COLOR_THEME } from "../../core/blockly/constants/colors";
import { virtualCircuitComment, whatIsAPin } from "../comment-text";

export default `<category name="Digital" colour="${COLOR_THEME.SENSOR}">
       <block type="digital_read_setup">
            <comment pinned="false" h="150" w="460">This block (digital read setup) tells the Arduino which pin is sense electricity.${whatIsAPin}${virtualCircuitComment}</comment>
       </block>
       <block type="digital_read">
            <comment pinned="false" h="70" w="460">Returns true if the sensor is sensing something.</comment>
       </block>
   </category>`;
