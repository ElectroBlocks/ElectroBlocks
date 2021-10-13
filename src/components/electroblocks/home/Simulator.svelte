<script>
  import Player from './Player.svelte';

  import SimDebugger from './SimDebugger.svelte';
  import LedColorChanger from './LedColorChanger.svelte';

  import { SVG } from '@svgdotjs/svg.js';
  import frameStore from '../../../stores/frame.store';
  import currentFrameStore from '../../../stores/currentFrame.store';
  import settings from '../../../stores/settings.store';
  import { resizeStore } from '../../../stores/resize.store';
  import paint from '../../../core/virtual-circuit/paint.ts';
  import update from '../../../core/virtual-circuit/update.ts';
  // What if we made everything a series of components.
  import { onMount, onDestroy } from 'svelte';
  import { onErrorMessage } from '../../../help/alerts';
  import { wait } from '../../../helpers/wait';
  let container;
  let frames = [];
  let currentFrame = undefined;
  let draw;
  let unsubscribes = [];
  onMount(async () => {
    try {
      await import('@svgdotjs/svg.draggable.js');

      await import('@svgdotjs/svg.panzoom.js');
    } catch (e) {
      onErrorMessage('Please refresh your browser and try again.', e);
    }

    let width = container.clientWidth - 10;
    let height = container.clientHeight - 10;
    let count = 0;
    while (width < 0 || height < 0) {
      console.log('waiting to load');
      width = container.clientWidth - 10;
      height = container.clientHeight - 10;
      await wait(5);
      count += 1;
      if (count > 1000) {
        onErrorMessage('There is not enough room to render the Arduino', {});
        return;
      }
    }

    // THE VIEWBOX MUST BE THE SAME SIZE AS THE COMPONENT OR VIEW
    // OTHERWISE WE DEAL WITH 2 COORDINATE SYSTEMS AND MATRIX MATH
    // DON'T DO IT!!!!!
    draw = SVG()
      .addTo(container)
      .size(container.clientWidth - 10, container.clientHeight - 10)
      .viewbox(0, 0, container.clientWidth - 10, container.clientWidth - 10)
      .panZoom();

    unsubscribes.push(
      frameStore.subscribe((frameContainer) => {
        frames = frameContainer.frames;
        const firstFrame = frames ? frames[0] : undefined;
        currentFrame = firstFrame;
        paint(draw, frameContainer);
        update(draw, firstFrame);
      })
    );

    unsubscribes.push(
      currentFrameStore.subscribe((frame) => {
        currentFrame = frame;
        update(draw, currentFrame);
      })
    );

    unsubscribes.push(
      resizeStore.subscribe(() => {
        draw.size(container.clientWidth - 10, container.clientHeight - 10);
      })
    );
  });

  function zoomIn() {
    draw.zoom(draw.zoom() + 0.05);
  }

  function zoomOut() {
    draw.zoom(draw.zoom() - 0.05);
  }
  onDestroy(() => {
    unsubscribes.forEach((unSubFunc) => unSubFunc());
  });
</script>

<div style="background-color: {$settings.backgroundColor}" id="container">
  <LedColorChanger />
  <div bind:this={container} id="simulator" />
  <div id="simulator-controls">
    <i on:click={zoomIn} class="fa fa-search-plus" aria-hidden="true" />
    <i on:click={zoomOut} class="fa fa-search-minus" aria-hidden="true" />
  </div>
  <SimDebugger />
</div>
<Player />

<style>
  #container,
  #simulator {
    width: 100%;
    height: calc(100% - 75px);
    position: relative;
    top: 0;
    left: 0;
  }
  #container {
    background-color: #d9e4ec;
  }
  #simulator {
    width: 100%;
    height: calc(100% - 10px);
  }
  #simulator-controls {
    text-align: right;
    position: absolute;
    right: 10px;
    bottom: 5px;
    user-select: none;
  }
  #simulator-controls i {
    cursor: pointer;
    margin-left: 10px;
    user-select: none;
  }
</style>
