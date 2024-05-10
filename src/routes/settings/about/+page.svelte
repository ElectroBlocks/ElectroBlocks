<script lang="ts">
  import { ListGroup, ListGroupItem } from "@sveltestrap/sveltestrap";
  import config from "../../../env";
</script>

<style>
  h2 {
    margin-top: 20px;
  }
  h3 {
    margin-top: 15px;
  }
  a {
    text-decoration: underline;
    color: blue;
  }
</style>

<svelte:head>
  <title>ElectroBlocks - About</title>
</svelte:head>

{#if config.site === 'electroblocks-org'}
  <div class="row">
    <div class="col">
      <h2>Back Story</h2>
    </div>
  </div>
  <div class="row">
    <div class="col">
      <p>
        ElectroBlocks is website for coding microcontrollers like the Arduino
        Uno and Arduino Mega. The basic idea is video editting for code. It
        allows you to create code with an easy to use drag and drop language
        called Blockly. I wanted to create something easy to use and fun for
        kids and adults to learn how to code.
      </p>
    </div>
  </div>

  <div class="row">
    <div class="col">
      <h2>Thank you</h2>
    </div>
  </div>
  <div class="row">
    <div class="col">
      <p>
        I have recieved advice and help from a number of mentors and
        professionals while building this. None of this would have been possible
        without their guidance. I also have volunteer taught and tutored. The
        experience from working with students has greatly influenced me. They
        are the inspiration behind my work.
      </p>
    </div>
  </div>

  <div class="row">
    <div class="col">
      <h2>Thank you to all Libraries</h2>
    </div>
  </div>

  <div class="row">
    <div class="col">
      <p>Without you none of this would have been possible.</p>
    </div>
  </div>

  <div class="row">
    <div class="col">
      <h3>Arduino Libraries</h3>
    </div>
  </div>
  <div class="row">
    <div class="col">
      <ListGroup>
        <ListGroupItem href="https://www.arduino.cc/">Arduino</ListGroupItem>
        <ListGroupItem href="https://github.com/arduino/arduino-cli">
          Arduino CLI
        </ListGroupItem>
        <ListGroupItem href="https://github.com/noopkat/avrgirl-arduino">
          ArvGirl Arduino
        </ListGroupItem>
        <ListGroupItem href="https://github.com/adafruit/Adafruit_NeoPixel">
          AdaFruit NeoPixel
        </ListGroupItem>
        <ListGroupItem href="https://github.com/johnrickman/LiquidCrystal_I2C">
          LiquidCrystal_I2C
        </ListGroupItem>
        <ListGroupItem href="https://github.com/z3t0/Arduino-IRremote">
          IRremote
        </ListGroupItem>
        <ListGroupItem href="https://github.com/adafruit/DHT-sensor-library">
          DHT sensor library
        </ListGroupItem>

        <ListGroupItem
          href="https://github.com/shaai/Arduino_LED_matrix_sketch">
          LedControlMS
        </ListGroupItem>
        <ListGroupItem href="https://github.com/electronicdrops/RFIDRdm630">
          RFIDRdm630
        </ListGroupItem>
        <ListGroupItem href="https://github.com/arduino-libraries/Servo">
          Servo
        </ListGroupItem>
        <ListGroupItem
          href="https://github.com/adafruit/Adafruit-Motor-Shield-library">
          Adafruit Motor Shield Library
        </ListGroupItem>
      </ListGroup>
    </div>
  </div>

  <div class="row">
    <div class="col">
      <h3>Web Libraries</h3>
    </div>
  </div>
  <div class="row">
    <div class="col">
      <ListGroup>
        <ListGroupItem href="https://developers.google.com/blockly/">
          Blockly
        </ListGroupItem>
        <ListGroupItem href="https://svelte.dev/">Svelte</ListGroupItem>
        <ListGroupItem href="https://getbootstrap.com">Bootstrap</ListGroupItem>
        <ListGroupItem href="https://sveltestrap.js.org">
          SvelteStrap
        </ListGroupItem>
        <ListGroupItem href="https://svgjs.com/docs/3.0/">svg.js</ListGroupItem>
        <ListGroupItem href="https://prismjs.com/">prismjs</ListGroupItem>
        <ListGroupItem href="https://lodash.com/">lodash</ListGroupItem>
        <ListGroupItem href="https://github.com/eligrey/FileSaver.js#readme">
          file-saver
        </ListGroupItem>
        <ListGroupItem href="https://sweetalert.js.org/guides/">
          sweetalert
        </ListGroupItem>
        <ListGroupItem href="https://github.com/axios/axios">
          axios
        </ListGroupItem>
      </ListGroup>
    </div>
  </div>
{/if}
