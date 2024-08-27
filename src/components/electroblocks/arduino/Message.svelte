<script>
  import arduionMessageStore from "../../../stores/arduino-message.store";
  import codeStore from "../../../stores/code.store";
  import arduinoStore, { PortState } from "../../../stores/arduino.store";

  import { upload } from "../../../core/serial/upload";

  import { afterUpdate } from "svelte";
  import { getBoard } from "../../../core/microcontroller/selectBoard";
  import { onErrorMessage, onSuccess } from "../../../help/alerts";
  import { tooltip } from "@svelte-plugins/tooltips";

  const navigatorSerialNotAvailableMessaeg = `To upload code you must use chrome or a chromium based browser like edge, or brave.  This will work with chrome version 89 or higher. `;

  // controls whether the messages should autoscroll
  let autoScroll = false;

  // List of messages
  let messages = [];

  // This is the arduino status where it's open close etc
  let arduinoStatus = PortState.CLOSE;

  // This is the value in the input text used to send messages to the Arduino
  let messageToSend = "";

  // This is the variable storing the arduino code
  let code;

  // The type of board we are using
  let boardType;

  // Message Element for displaying the message
  let messagesEl;

  // means that we already have seen the message
  let alreadyShownDebugMessage = false;

  $: uploadingClass =
    arduinoStatus === PortState.UPLOADING
      ? "fa-spinner fa-spin fa-6x fa-fw"
      : "fa-upload";

  codeStore.subscribe((codeInfo) => {
    code = codeInfo.code;
    boardType = codeInfo.boardType;
  });

  arduinoStore.subscribe((status) => {
    arduinoStatus = status;
  });

  arduionMessageStore.subscribe((newMessage) => {
    if (!newMessage) {
      return;
    }

    if (newMessage.message.includes("C_D_B_C_D")) {
      arduionMessageStore.sendMessage("START_DEBUG");
    }

    if (
      newMessage.message.includes("**(|)") ||
      newMessage.message.includes("DEBUG_BLOCK_") ||
      newMessage.message.includes("stop_debug") ||
      newMessage.message.includes("continue_debug") ||
      newMessage.message.includes("START_DEBUG") ||
      newMessage.message.includes("C_D_B_C_D")
    ) {
      return;
    }

    messages = [...messages, newMessage];
    return;
  });

  async function connectOrDisconnectArduino() {
    if (!navigator["serial"]) {
      onErrorMessage(navigatorSerialNotAvailableMessaeg);
      return;
    }

    if (arduinoStatus == PortState.OPEN) {
      arduinoStore.set(PortState.CLOSING);
      try {
        await arduionMessageStore.closePort();
      } catch (e) {
        onErrorMessage(
          "Sorry, error with the arduino.  Please refresh your browser to disconnect.",
          e
        );
      }
      arduinoStore.set(PortState.CLOSE);
      return;
    }
    arduinoStore.set(PortState.OPENNING);
    const board = getBoard(boardType);
    arduionMessageStore
      .connect(board.serial_baud_rate)
      .then(() => {
        arduinoStore.set(PortState.OPEN);
      })
      .catch((e) => {
        if (e.message.toLowerCase() === "no port selected by the user.") {
          arduinoStore.set(PortState.CLOSE);
          return;
        }
        arduinoStore.set(PortState.CLOSE);
        onErrorMessage("Sorry, please refresh your browser and try again.", e);
      });
  }

  function sendMessage() {
    if (arduinoStatus !== PortState.OPEN) {
      return;
    }
    try {
      arduionMessageStore.sendMessage(messageToSend);
      messageToSend = "";
    } catch (e) {
      console.log(e, "sendMessage error");
    }
  }

  async function uploadCode() {
    if (!navigator["serial"]) {
      onErrorMessage(navigatorSerialNotAvailableMessaeg);
      return;
    }

    if (arduinoStatus !== PortState.CLOSE) {
      return;
    }
    arduinoStore.set(PortState.UPLOADING);
    try {
      const avrgirl = new AvrgirlArduino({
        board: boardType,
        debug: true,
      });

      await upload(code, avrgirl, boardType);
      onSuccess("Your code is uploaded!! :)");
    } catch (e) {
      if (e.message.toLowerCase() === "no port selected by the user.") {
        arduinoStore.set(PortState.CLOSE);
        return;
      }
      if (e.message.includes("receiveData timeout after")) {
        console.log(e, "eating these errors.  Everything should work!");
        onSuccess("Your code is uploaded!! :)");
        arduinoStore.set(PortState.CLOSE);
        return;
      }
      onErrorMessage("Sorry, please try again in 5 minutes. :)", e);
    }
    arduinoStore.set(PortState.CLOSE);
  }
  function clearMessages() {
    messages = [];
  }

  afterUpdate(() => {
    if (autoScroll) {
      messagesEl.scrollTop = messagesEl.scrollHeight;
    }
  });

  function toggleAutoScroll() {
    autoScroll = !autoScroll;
  }
</script>

<section bind:this={messagesEl} id="messages">
  {#each messages as mes (mes.id)}
    <article class="message-computer">
      <p>
        <img
          src={mes.type === "Computer" ? "./laptop.png" : "./cpu.png"}
          alt={mes.type === "Computer" ? "computer" : "arduino"}
        />
        {mes.message}
        ({mes.time})
      </p>
    </article>
  {/each}
</section>
<section id="send-message-container">
  <form on:submit|preventDefault={sendMessage}>
    <input
      readonly={!(arduinoStatus === PortState.OPEN)}
      type="text"
      bind:value={messageToSend}
      placeholder="send message"
    />
  </form>
  <button
    use:tooltip
    title="Send Message"
    disabled={!(arduinoStatus === PortState.OPEN)}
    on:click={sendMessage}
  >
    <i class="fa fa-paper-plane" />
  </button>
  {#if arduinoStatus == PortState.OPEN}
    <button
      title="Disconnect from Arduino"
      use:tooltip
      on:click={connectOrDisconnectArduino}
    >
      <i class="fa" class:fa-eject={arduinoStatus === PortState.OPEN} />
    </button>
  {:else if arduinoStatus === PortState.CLOSE}
    <button
      title="Connect to Arduino"
      use:tooltip
      on:click={connectOrDisconnectArduino}
    >
      <i class="fa" class:fa-usb={arduinoStatus === PortState.CLOSE} />
    </button>
  {:else}
    <button>
      <i class="fa fa-spinner fa-spin fa-6x fa-fw" />
    </button>
  {/if}

  <button
    use:tooltip
    title="Upload code"
    disabled={!(arduinoStatus === PortState.CLOSE)}
    on:click={uploadCode}
  >
    <i class="fa {uploadingClass}" />
  </button>
  <button use:tooltip title="Delete" on:click={clearMessages}>
    <i class="fa fa-trash" />
  </button>
  <button
    use:tooltip
    title="Autoscroll"
    class:scroll-active={autoScroll}
    on:click={toggleAutoScroll}
  >
    <i class="fa fa-angle-double-down" />
  </button>
</section>

<style>
  #messages {
    padding: 10px;
    font-size: 18px;
    overflow: scroll;
    height: calc(100% - 80px);
  }
  #messages p img {
    vertical-align: middle;
  }
  #send-message-container {
    display: flex;
    justify-content: space-between;
    width: 98%;
    margin: auto;
    height: 50px;
  }
  #send-message-container form {
    flex: 4;
  }
  #send-message-container input {
    width: 98%;
    margin: 5px;
    outline: none;
    border: none;
    font-size: 25px;
    height: 40px;
    border-bottom: 1px solid #505bda;
    transition: linear 1s border-bottom;
  }
  #send-message-container input:active,
  #send-message-container input:focus {
    outline: none;
    border-bottom: 2px solid #505bda;
  }
  #send-message-container input:read-only {
    cursor: not-allowed;
    color: #fff;
  }
  button {
    margin: 5px;
    border-radius: 2px;
    font-size: 20px;
    padding: 5px 10px;
    width: 50px;
    height: 36px;
    margin-top: 10px;
    cursor: pointer;
    color: black;
    background-color: rgb(254 244 255);
    border: none;
  }
  button i {
    transition: ease-in-out 0.4s font-size;
  }
  button:focus,
  button:active {
    outline: none;
  }
  button:active i {
    font-size: 18px;
  }
  button:disabled {
    cursor: not-allowed;
    background-color: rgb(255, 255, 255);
    color: #dce6de;
  }
  button:disabled i {
    font-size: 20px;
  }
  .fa-eject {
    color: #eb423c;
  }
  .fa-usb {
    color: #b063c5;
  }
  button:not(:disabled) .fa-paper-plane {
    color: #16bb3a;
  }
  .fa-trash {
    color: #16bb3a;
  }
  .scroll-active {
    font-size: 18px;
    color: #16bb3a;
  }
</style>
