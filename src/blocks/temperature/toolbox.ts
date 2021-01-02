import { COLOR_THEME } from "../../core/blockly/constants/colors";
import { virtualCircuitComment } from "../comment-text";

export default `
<category name="Temp" colour="${COLOR_THEME.SENSOR}"  >
         <block type="temp_setup">
         <comment pinned="false" h="160" w="460">This sensor will read the temperature in Celius and the humidity.  Be sure to specify the sensor type.${virtualCircuitComment}</comment>
         </block>
         <block type="temp_get_temp">
          <comment pinned="false" h="60" w="460">Returns the temperature in Celius.</comment>
         </block>
         <block type="temp_get_humidity">
            <comment pinned="false" h="60" w="460">Returns the humidity percentage.</comment>
         </block>
       </category>
`;
