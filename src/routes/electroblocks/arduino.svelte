<script>
  import VerticalComponentContainer from "../../components/electroblocks/VerticalComponentContainer.svelte";
  import Debug from "../../components/electroblocks/arduino/Debug.svelte";
  import Message from "../../components/electroblocks/arduino/Message.svelte";
  import selectedBoard from "../../core/blockly/selectBoard";

  let isConnected = false;
  let writer;
  let reader;
  const textDecoder = new TextDecoder("UTF-8");

  class LineBreakTransformer {
    constructor() {
      // A container for holding stream data until a new line.
      this.chunks = "";
    }

    transform(chunk, controller) {
      // Append new chunks to existing chunks.
      this.chunks += chunk;
      console.log(chunk);
      // For each line breaks in chunks, send the parsed lines out.
      const lines = this.chunks.split("\n");
      this.chunks = lines.pop();
      lines.forEach(line => controller.enqueue(line));
    }

    flush(controller) {
      // When the stream is closed, flush any remaining chunks out.
      controller.enqueue(this.chunks);
    }
  }

  async function connectArduino() {
    const port = await navigator.serial.requestPort();
    await port.open({ baudrate: selectedBoard().serial_baud_rate });

    const textDecoder = new TextDecoderStream();
    const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
    let string = "";
    // Open and begin reading.
    const reader = textDecoder.readable
      .pipeThrough(new TransformStream(new LineBreakTransformer()))
      .getReader();
    console.log(reader);
    window.reader = reader;
    // Listen to data coming from the serial device.
    while (true) {
      console.log("before");
      const { value, done } = await reader.read();
      console.log("after", value, done, "data");
      if (done) {
        reader.releaseLock();
        break;
      }
      console.log(value, "value ");
    }
  }
</script>

<style>
  .slot-wrapper {
    height: 100%;
    width: 100%;
  }
</style>

<VerticalComponentContainer>
  <div class="slot-wrapper" slot="top">
    {#if isConnected}
      <Message />
    {:else}
      <div>
        <button on:click={connectArduino}>Connect Arduion</button>
        <button on:click={() => alert('Hello World')}>Not Block</button>
      </div>
    {/if}
  </div>
  <div class="slot-wrapper" slot="bottom">
    {#if isConnected}
      <Debug />
    {/if}
  </div>
</VerticalComponentContainer>
