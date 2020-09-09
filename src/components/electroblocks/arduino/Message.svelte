<script>
  import arduionMessageStore from "../../../stores/arduino-message.store";
  import codeStore from "../../../stores/code.store";
  import arduinoStore, { PortState } from "../../../stores/arduino.store";
  import { WindowType, resizeStore } from "../../../stores/resize.store";

  import { upload } from "../../../core/serial/upload";
  import { selectedBoard } from "../../../core/microcontroller/selectBoard";

  import { afterUpdate } from "svelte";

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

  // Message Element for displaying the message
  let messagesEl;

  // means that we already have seen the message
  let alreadyShownDebugMessage = false;

  $: uploadingClass =
    arduinoStatus === PortState.UPLOADING
      ? "fa-spinner fa-spin fa-6x fa-fw"
      : "fa-upload";

  codeStore.subscribe((newCode) => {
    code = newCode;
  });

  arduinoStore.subscribe((status) => {
    console.log(status, "arduino status");
    arduinoStatus = status;
  });

  arduionMessageStore.subscribe((newMessage) => {
    console.log(newMessage, "newMessage");

    if (!newMessage) {
      return;
    }

    if (
      newMessage.message.includes("**(|)") ||
      newMessage.message.includes("DEBUG_BLOCK_") ||
      newMessage.message.includes("stop_debug") ||
      newMessage.message.includes("continue_debug") ||
      newMessage.message.includes("START_DEBUG")
    ) {
      return;
    }
    if (newMessage.type === "Arduino" && newMessage.message.includes("C_D_B")) {
      // We only want to send the intro start debugging message once
      if (alreadyShownDebugMessage) {
        return;
      }
      alreadyShownDebugMessage = true;
      messages = [
        ...messages,
        {
          message: "Click the bug to start debugging.",
          type: "Arduino",
          id: new Date().getTime() + "_" + Math.random().toString(),
          time: new Date().toLocaleTimeString(),
        },
      ];
      return;
    }

    messages = [...messages, newMessage];
    return;
  });

  async function connectOrDisconnectArduino() {
    if (arduinoStatus == PortState.OPEN) {
      arduinoStore.set(PortState.CLOSING);
      try {
        await arduionMessageStore.closePort();
      } catch (e) {
        console.error("close port error", e);
        alert(
          "Please report that there was an error closing the port " + e.message
        );
      }

      arduinoStore.set(PortState.CLOSE);
      return;
    }
    try {
      arduinoStore.set(PortState.OPENNING);
      const requestOptions = {
        // Filter on devices with the Arduino USB vendor ID.
        filters: [{ usbVendorId: 0x2341, usbProductId: 0x0043 }],
      };
      const port = await navigator.serial.requestPort(requestOptions);
      arduionMessageStore.connect(port).then();
      arduinoStore.set(PortState.OPEN);
    } catch (error) {
      console.error(error, "error");
      console.log("connectArduino error");
      arduinoStore.set(PortState.CLOSE);
    }
  }

  async function closePort() {
    arduinoStore.set(PortState.CLOSING);
    try {
      await arduionMessageStore.closePort();
    } catch (e) {
      console.error(e);
      console.log("closePort error");
    }

    arduinoStore.set(PortState.CLOSE);
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
    if (arduinoStatus !== PortState.CLOSE) {
      return;
    }
    arduinoStore.set(PortState.UPLOADING);
    try {
      const avrgirl = new AvrgirlArduino({
        board: selectedBoard().type,
        debug: true,
      });
      await upload(code, avrgirl);
    } catch (e) {
      console.error(e, "error message");
      alert(
        "There was an error uploading your code.  Please check console for error messages."
      );
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
    border: none;
    border-radius: 2px;
    font-size: 20px;
    padding: 0 10px;
    width: 50px;
    height: 40px;
    margin-top: 10px;
    cursor: pointer;
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
    background-color: rgb(251, 251, 247);
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

<section bind:this={messagesEl} id="messages">
  {#each messages as mes (mes.id)}
    <article class="message-computer">
      <p>
        <img
          src={mes.type === 'Computer' ? './laptop.png' : './cpu.png'}
          alt={mes.type === 'Computer' ? 'computer' : 'arduino'} />
        {mes.message} ({mes.time})
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
      placeholder="send message" />
  </form>
  <button disabled={!(arduinoStatus === PortState.OPEN)} on:click={sendMessage}>
    <i class="fa fa-paper-plane" />
  </button>
  <button
    disabled={arduinoStatus !== PortState.OPEN && arduinoStatus !== PortState.CLOSE}
    on:click={connectOrDisconnectArduino}>
    <i
      class="fa"
      class:fa-eject={arduinoStatus === PortState.OPEN}
      class:fa-usb={arduinoStatus === PortState.CLOSE} />
  </button>

  <button disabled={!(arduinoStatus === PortState.CLOSE)} on:click={uploadCode}>
    <i class="fa {uploadingClass}" />
  </button>
  <button on:click={clearMessages}> <i class="fa fa-trash" /> </button>
  <button class:scroll-active={autoScroll} on:click={toggleAutoScroll}>
    <i class="fa fa-arrow-down" />
  </button>
</section>
