<script>
  import arduinoStore, { PortState } from "../../../stores/arduino.store";
  import arduionMessageStore from "../../../stores/arduino-message.store";
  import { rgbToHex } from "../../../core/blockly/helpers/color.helper";

  // This is the variable list used to print all the variables
  let variables = [];

  // we temporarily store variables here until all our complete
  let tempVariables = [];

  // state of the arduino
  let portStatus = PortState.CLOSE;

  // This is means that the arduino is in the debug mode and can recieve a continue or stop message
  let inDebugStatement = false;

  // If true it means that debugging can start
  let debugStart = false;

  arduinoStore.subscribe((newPortStatus) => {
    portStatus = newPortStatus;
    if (portStatus === PortState.CLOSE) {
      debugStart = false;
    }
  });

  arduionMessageStore.subscribe((message) => {
    if (!message) {
      return;
    }

    if (message.message.includes("START_DEBUG")) {
      debugStart = true;
    }

    if (message.type === "Computer") {
      return;
    }

    if (message.message.includes("DEBUG_BLOCK_")) {
      variables = [...tempVariables];
      tempVariables = [];
      inDebugStatement = true;
      return;
    }

    if (!message.message.includes("**(|)")) {
      return;
    }

    const [name, type, value] = message.message
      .replace("**(|)", "")
      .split("_|_");

    const varIndex = tempVariables.findIndex((v) => v.name === name);
    if (varIndex > -1) {
      tempVariables[varIndex] = { name, type, value };
      return;
    }
    tempVariables.push({ name, type, value });
  });

  function colorValueString(colorString) {
    const [red, green, blue] = colorString
      .replace("{", "")
      .replace("}", "")
      .split("-")
      .map((colorNum) => parseInt(colorNum, 0));
    return `(red=${red},green=${green},blue=${blue})`;
  }

  function colorValueHex(colorString) {
    const [red, green, blue] = colorString
      .replace("{", "")
      .replace("}", "")
      .split("-")
      .map((colorNum) => parseInt(colorNum, 0));

    return rgbToHex({ red, green, blue });
  }

  function parseColorList(colorListString) {
    return colorListString
      .replace("[", "")
      .replace("]", "")
      .split(",")
      .map((colorString) => {
        const [red, green, blue] = colorString
          .replace("{", "")
          .replace("}", "")
          .split("-")
          .map((colorNum) => parseInt(colorNum, 0));

        return {
          red,
          green,
          blue,
        };
      });
  }

  $: disableDebugBtn = portStatus !== PortState.OPEN || !inDebugStatement;

  function continueDebug() {
    if (inDebugStatement) {
      arduionMessageStore.sendMessage("continue_debug");
      inDebugStatement = false;
    }
  }

  function stopDebug() {
    if (inDebugStatement) {
      arduionMessageStore.sendMessage("stop_debug");
      inDebugStatement = false;
    }
  }
</script>

<div id="debug">
  <h3>
    Debug
    <span>
      <i
        class="fa fa-play"
        on:click={continueDebug}
        class:not-active={disableDebugBtn}
      />
      <i
        class="fa fa-stop"
        on:click={stopDebug}
        class:not-active={disableDebugBtn}
      />
      <i class:debug-start={debugStart} class="fa fa-bug" />
    </span>
  </h3>
  <div id="variable-table-container">
    <table id="variable-table">
      <thead>
        <tr>
          <th>Variable Name</th>
          <th>Data Type</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody id="variable-tbody">
        {#each variables as variable (variable.id)}
          <tr class:coloredElement={variable.type === 'Colour'}>
            <td>{variable.name}</td>
            <td>{variable.type}</td>
            <td>
              {#if variable.type !== 'Colour' && variable.type !== 'List Colour'}
                {variable.value}
              {/if}
              {#if variable.type === 'Colour'}
                <span
                  style="color: {colorValueHex(variable.value)}"
                  class="coloredElement"
                >
                  {colorValueString(variable.value)}
                </span>
              {/if}
              {#if variable.type === 'List Colour'}
                <span class="colorValue">
                  {#each parseColorList(variable.value) as colorValue, index}
                    <span
                      style="background-color: {rgbToHex(colorValue)}"
                      class="coloredElement"
                    >
                      {index + 1}
                    </span>
                  {/each}
                </span>
              {/if}
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>

<style>
  #debug {
    width: 100%;
    height: 100%;
  }
  /** Top Menu **/
  h3 {
    margin: 0;
    padding: 10px;
    font-size: 20px;
  }
  h3 span {
    margin-right: 10px;
    float: right;
  }
  .fa {
    margin: 0 10px;
    cursor: pointer;
  }
  .fa-play {
    color: #23922b;
  }
  .fa-stop {
    color: #aa0000;
  }
  .fa.fa-bug {
    cursor: inherit;
  }
  .not-active {
    color: gray !important;
    pointer-events: none;
    cursor: not-allowed;
  }

  /** Debug Table */
  #variable-table-container {
    overflow: scroll;
    margin-bottom: 10px;
  }

  #variable-table {
    border-collapse: collapse;
    width: 100%;
    font-weight: 600;
  }

  #variable-table td,
  #variable-table th {
    border: 1px solid #ddd;
    padding: 8px;
    background-color: white;
  }

  #variable-table tr:nth-child(even) {
    background-color: #f2f2f2;
  }

  #variable-table tr:hover {
    background-color: #ddd;
  }

  #variable-table th {
    padding-top: 12px;
    padding-bottom: 12px;
    text-align: left;
    background-color: #505bda;
    color: white;
  }

  .colorValue {
    color: white;
  }

  .coloredElement {
    margin-left: 10px;
    padding: 0 7px;
  }
  .colorValue .coloredElement:first-of-type {
    margin-left: 0;
  }
  .debug-start {
    font-size: 18px;
    color: #23922b;
  }
</style>
