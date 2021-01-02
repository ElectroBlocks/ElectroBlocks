import { COLOR_THEME } from "../../core/blockly/constants/colors";
import { virtualCircuitComment } from "../comment-text";

export default `<category name="IR Remote" colour="${COLOR_THEME.SENSOR}" >
<block type="ir_remote_setup">
       <comment pinned="false" h="200" w="460">This block sets up the ir remote sensor.${virtualCircuitComment}</comment>
</block>
<block type="ir_remote_has_code_receive">
       <comment pinned="false" h="60" w="460">Returns true if the ir sensor has received a message.</comment>
</block>
<block type="ir_remote_get_code">
       <comment pinned="false" h="60" w="460">Get's the message that the ir remote received.</comment>
</block>
</category>`;
