import { COLOR_THEME } from "../../core/blockly/constants/colors";
import { virtualCircuitComment, whatIsAPin } from "../comment-text";

export default `
<category name="Analog" colour="${COLOR_THEME.SENSOR}" >
       <block type="analog_read_setup">
            <comment pinned="false" h="200" w="501">This block (analog read setup) tells the Arduino which pin is sense electricity.${whatIsAPin}${virtualCircuitComment}</comment>
        </block>
       <block type="analog_read">
            <comment pinned="false" h="140" w="460">This block (analog read) senses the amount of electricity flowing through a pin.${whatIsAPin}</comment>
       </block>
   </category>
`;
