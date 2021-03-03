import { COLOR_THEME } from "../../core/blockly/constants/colors";
import { virtualCircuitComment } from "../comment-text";

export default `
<category name="Thermistor" colour="${COLOR_THEME.SENSOR}" >
       <block type="thermistor_setup">
            <comment pinned="false" h="180" w="460">This block will setup the thermistor which is used to measure temperature.${virtualCircuitComment}</comment>
            <field name="PIN">A0</field>

       </block>

       <block type="thermistor_read">
        <comment pinned="false" h="60" w="460">Return the temperature in Celcius.</comment>
       </block>
       </category>
`;
