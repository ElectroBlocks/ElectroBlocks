<script>
  import { onMount } from 'svelte';
  import Nav from '../../components/electroblocks/Nav.svelte';
  import Blockly from '../../components/electroblocks/Blockly.svelte';
  import Player from '../../components/electroblocks/home/Player.svelte';
  import { resizeStore } from '../../stores/resize.store';

  // flex size of top window
  let top = 0;
  // flex size of bottom window
  let bottom = 200;
  // true if resizing windows
  let isResizing = false;
  // container element
  let mainSection;

  let previousMainHeight = 0;

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

  const onResize = (e) => {
    resize(e.clientY);
  };

  function onResizeWindow(e) {
    setTimeout(() => {
      console.log(
        Math.abs(previousMainHeight - mainSection.clientHeight),
        'resize dif'
      );
      if (Math.abs(previousMainHeight - mainSection.clientHeight) < 100) {
        return;
      }

      previousMainHeight = mainSection.clientHeight;

      top = mainSection.clientHeight - 180;
      bottom = 160;
      // Trigger an side windows that need to be resized
      resizeStore.sideWindow();
    }, 5);
  }

  /**
   * This is a mouse move event on the main section of the html
   * It will resize the 2 windows,
   * Slight Trottling with debounce
   */
  const resize = (clientY) => {
    if (!isResizing) {
      return;
    }

    // hack not the best way to go
    const navBarHeight = document.querySelector('nav').clientHeight + 10;

    const clientRelativeToWindow = clientY - navBarHeight;

    // Height of the main area where we are dividing
    const mainHeight = mainSection.clientHeight;

    // If the either window size is less than 200 px don't resize window
    if (
      clientRelativeToWindow < 100 ||
      mainHeight - clientRelativeToWindow < 100
    ) {
      return;
    }

    // Derive the from bottom flex calculation
    // Reason we are not doing reactive variable is because we want to make it obvious
    top = clientRelativeToWindow - 10;
    bottom = mainHeight - top - 17;

    // Trigger an side windows that need to be resized
    resizeStore.sideWindow();
  };

  onMount(() => {
    setTimeout(() => {
      top = mainSection.clientHeight - 180;
      bottom = 160;
      previousMainHeight = top;
    }, 1);
  });
</script>

<svelte:body on:mouseup={stopResize} />

<main
  on:mouseleave={stopResize}
  on:mousemove={onResize}
  bind:this={mainSection}
  id="split-container"
>
  <section style="height: {top}px" id="top">
    <slot class="sections" name="top" />
  </section>
  <div on:mousedown={startResize} id="grabber" />
  <section style="height: {bottom}px" id="bottom">
    <slot name="bottom" />
  </section>
</main>
<svelte:window on:resize={onResizeWindow} />

<style>
  main {
    height: 100%;
  }

  #bottom {
    overflow-y: scroll;
  }

  /** the div used to resize the windows */
  #grabber {
    height: 20px;
    width: 100%;
    cursor: row-resize;
    background-color: #eff0f1;
    background-position: center center;
    background-repeat: no-repeat;
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAFCAMAAABl/6zIAAAABlBMVEUAAADMzMzIT8AyAAAAAXRSTlMAQObYZgAAABRJREFUeAFjYGRkwIMJSeMHlBkOABP7AEGzSuPKAAAAAElFTkSuQmCC);
  }
</style>
