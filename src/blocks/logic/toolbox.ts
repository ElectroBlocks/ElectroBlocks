import { COLOR_THEME } from "../../core/blockly/constants/colors";

export default `
<category name="Logic" colour="${COLOR_THEME.CONTROL}">
    <block type="control_if">
        <comment pinned="false" h="150" w="460">"If blocks" will run the code in the Then section if what is inside the If what is attached to IF Section equals true.  If you connected the is_button_pressed block to the IF Section and the button is pressed, then the then section’s code will run.</comment>
    </block>
    <block type="controls_ifelse">
<comment pinned="false" h="150" w="460">If Else blocks" will run the code in the Then section if what is inside the If what is attached to IF Section equals true.  If you connected the is_button_pressed block to the IF Section and the button is pressed, then the then section’s code will run.  If the button is not pressed the else section would run.</comment>
    </block>
    <block type="logic_compare">
    <comment pinned="false" h="140" w="527">Compares what is in the left and right holes and returns true or false.

If the operator =, it will check if both values are the same.
If the operator \u2260, it will check if both values are different.</comment>
    </block>
    <block type="logic_operation">
<comment pinned="false" h="170" w="527">Compares what is in the left and right holes and returns true or false.

If the operator is "and", it will check if both values are equal to true.
If the operator is "or", it will check if one of the values are true.</comment>
    </block>
    <block type="logic_negate">
    <comment pinned="false" h="80" w="460">Will take a true and turn it to false and take a false and turn it into true.</comment>
    </block>
    <block type="logic_boolean"></block>
</category>
`;
