import { COLOR_THEME } from "../../core/blockly/constants/colors";

export default `
<category name="Logic" colour="${COLOR_THEME.CONTROL}">
    <block type="control_if">
        <comment pinned="false" h="150" w="460">The if statement checks a condition and executes the following block of code if the condition is true.</comment>
    </block>
    <block type="controls_ifelse">
<comment pinned="false" h="150" w="460"> It checks a condition using the if statement, executes a block of code if the condition is true, and otherwise executes the code inside the  block when the condition is false.</comment>
    </block>
    <block type="logic_compare">
    <comment pinned="false" h="140" w="527">Compares what is in the left and right and returns true or false.</comment>
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
