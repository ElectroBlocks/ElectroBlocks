<script>
  import Nav from "../../components/electroblocks/Nav.svelte";
  import Blockly from "../../components/electroblocks/Blockly.svelte";
  import Player from "../../components/electroblocks/home/Player.svelte";
  import { resizeStore } from "../../stores/resize.store";

  // flex size of top window
  let topFlex = 69;
  // flex size of bottom window
  let bottomFlex = 29;
  // true if resizing windows
  let isResizing = false;
  // container element
  let mainSection;

  /**
   * Event is on grabber on is trigger by a mouse down event
   */

  function startResize() {
    isResizing = true;
  }

  /**
   * Event is on the body so that all mouse up events stop resizing
   */

  function stopResize() {
    isResizing = false;
  }

  /**
   * This is a mouse move event on the main section of the html
   * It will resize the 2 windows,
   * Slight Trottling with debounce
   */

  const resize = e => {
    if (!isResizing) {
      return;
    }

    // subtract 100 because of the height of the menu
    const clientRelativeToWindow = e.clientY - 50;

    // Height of the main area where we are dividing
    const mainHeight = mainSection.clientHeight;

    // If the either window size is less than 200 px don't resize window
    if (
      clientRelativeToWindow < 20 ||
      mainHeight - clientRelativeToWindow < 20
    ) {
      return;
    }

    // Goal is to get the percentage
    // and minus 1/2 percent from that to account for the grabber
    bottomFlex =
      ((mainHeight - clientRelativeToWindow) / mainHeight) * 100 - 0.5;

    // Derive the from bottom flex calculation
    // Reason we are not doing reactive variable is because we want to make it obvious
    topFlex = 100 - bottomFlex - 0.5;

    // Trigger an side windows that need to be resized
    resizeStore.sideWindow();
  };
</script>

<style>
  main {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  #bottom {
    overflow-y: scroll;
  }

  /** the div used to resize the windows */
  #grabber {
    flex: 2;
    width: 100%;
    cursor: row-resize;
    background-color: #eff0f1;
    background-position: center center;
    background-repeat: no-repeat;
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAFCAMAAABl/6zIAAAABlBMVEUAAADMzMzIT8AyAAAAAXRSTlMAQObYZgAAABRJREFUeAFjYGRkwIMJSeMHlBkOABP7AEGzSuPKAAAAAElFTkSuQmCC);
  }
</style>

<svelte:body on:mouseup={stopResize} />

<main
  on:mouseleave={stopResize}
  on:mousemove={resize}
  bind:this={mainSection}
  id="split-container">

  <section style="flex: {topFlex}" id="top">
    <slot class="sections" name="top" />
  </section>
  <div on:mousedown={startResize} id="grabber" />
  <section style="flex: {bottomFlex}" id="bottom">
    <slot name="bottom" />
  </section>
</main>
