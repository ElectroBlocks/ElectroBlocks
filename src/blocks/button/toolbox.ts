import { COLOR_THEME } from "../../core/blockly/constants/colors";

export default `<category name="Button" colour="${COLOR_THEME.SENSOR}">       
<block type="button_setup">
      <comment pinned="false" h="200" w="460">Initialise the program settings and configurations</comment>
</block>
<block type="is_button_pressed">
</block>
<block type="release_button">
  <comment pinned="false" h="60" w="460">Releases the button on the only simulation.</comment>
</block>
</category>`;
