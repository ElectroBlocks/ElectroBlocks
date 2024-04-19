<script>
  import Player from './Player.svelte';

  import SimDebugger from './SimDebugger.svelte';
  import LedColorChanger from './LedColorChanger.svelte';

  import { SVG } from '@svgdotjs/svg.js';
  import frameStore from '../../../stores/frame.store';
  import currentFrameStore from '../../../stores/currentFrame.store';
  import settings from '../../../stores/settings.store';
  import { resizeStore, WindowType } from '../../../stores/resize.store';
  import paint from '../../../core/virtual-circuit/paint';
  import update from '../../../core/virtual-circuit/update';
  // What if we made everything a series of components.
  import { onMount, onDestroy, tick } from 'svelte';
  import { onErrorMessage } from '../../../help/alerts';
  import { wait } from '../../../helpers/wait';
  import { arduinoComponentStateToId } from '../../../core/frames/arduino-component-id';
  import { centerCircuit } from '../../../core/virtual-circuit/centerCircuit';
  import { page } from '$app/stores';
  import showLessonsStore from '../../../stores/showLessons.store';


  let container;
  let frames = [];
  let currentFrame = undefined;
  let draw;
  let unsubscribes = [];
  let loopText = '';

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
        let oldLastFrame =
          frames.length > 0 ? frames[frames.length - 1] : undefined;
        frames = frameContainer.frames;
        const firstFrame = frames ? frames[0] : undefined;
        const lastFrame = frames ? frames[frames.length - 1] : undefined;
        currentFrame = firstFrame;
        paint(draw, frameContainer);
        update(draw, firstFrame);

        const oldListOfComponentIds = oldLastFrame
          ? oldLastFrame.components
              .map((f) => {
                try {
                  return arduinoComponentStateToId(f);
                } catch {
                  return '';
                }
              })
              .join('')
          : '';

        const newListOfComponentIds = lastFrame
          ? lastFrame.components
              .map((f) => {
                try {
                  return arduinoComponentStateToId(f);
                } catch {
                  return '';
                }
              })
              .join('')
          : '';

        if (newListOfComponentIds != oldListOfComponentIds) {
          centerCircuit(draw, lastFrame);
        }
      })
    );

    unsubscribes.push(
      currentFrameStore.subscribe((frame) => {
        currentFrame = frame;
        update(draw, currentFrame);
      })
    );

    unsubscribes.push(
      resizeStore.subscribe(async ({ type }) => {
        draw.size(container.clientWidth - 10, container.clientHeight - 10);
        if (type == WindowType.MAIN) {
          await tick();
          await tick();
          reCenter();
        }
      })
    );

    unsubscribes.push(
      page.subscribe(() => {
        if (draw) {
          const lastFrame = frames ? frames[frames.length - 1] : undefined;
          centerCircuit(draw, lastFrame);
        }
      })
    );

    unsubscribes.push(
      currentFrameStore.subscribe((frame) => {
        if (!frame) return;

        if (frame.timeLine.function === 'pre-setup') {
          loopText = 'Setup Code';
          return;
        }

        if (frame.timeLine.function === 'setup') {
          loopText = 'Setup Block';
          return;
        }
        loopText = `Loop: ${frame.timeLine.iteration}`;
      })
    );
  });

  function zoomIn() {
    draw.zoom(draw.zoom() + 0.05);
  }

  function zoomOut() {
    draw.zoom(draw.zoom() - 0.05);
  }

  function reCenter() {
    if (draw) {
      centerCircuit(
        draw,
        frames.length > 0 ? frames[frames.length - 1] : undefined
      );
    }
  }

  onDestroy(() => {
    unsubscribes.forEach((unSubFunc) => unSubFunc());
  });
</script>

<div style="background-color: {$settings.backgroundColor}" id="container">
  <LedColorChanger />
  <div bind:this={container} id="simulator" />
  <div id="simulator-controls">
    <h3>{loopText}</h3>
    <i on:click={reCenter} class="fa" id="recenter-icon" aria-hidden="true" />
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
    width: 100%;
  }
  #simulator-controls i {
    cursor: pointer;
    margin-left: 10px;
    user-select: none;
  }
  #recenter-icon {
    background-image: url(/target.svg?raw);
    width: 25px;
    height: 25px;
    background-size: contain;
    vertical-align: middle;
    background-repeat: no-repeat;
  }

  h3 {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: -5px;
  }
</style>
