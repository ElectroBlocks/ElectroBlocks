import { COLOR_THEME } from "../../core/blockly/constants/colors";
import { virtualCircuitComment } from "../comment-text";

export default `
<category name="Motion" colour="${COLOR_THEME.SENSOR}" >
       <block type="ultra_sonic_sensor_setup">
       <comment pinned="false" h="180" w="460">This block will setup the Ultrasonic sensor, which measures distance.  It uses ultra-sonic sound waves to do this.${virtualCircuitComment}</comment>
         <field name="PIN_TRIG">11</field>
         <field name="PIN_ECHO">10</field>
       </block>
       <block type="ultra_sonic_sensor_motion">
        <comment pinned="false" h="60" w="460">Returns the number of centimeters the sensor sensed.</comment>
       </block>
       </category>
`;
