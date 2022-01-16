<script lang="ts">
  import { onMount } from 'svelte';
  import _ from 'lodash';
  import firebase from 'firebase/app';

  import { FormGroup, Input, Label, Button } from 'sveltestrap/src';

  import { isPathOnHomePage } from '../helpers/is-path-on-homepage';
  import Nav from '../components/electroblocks/Nav.svelte';
  import Blockly from '../components/electroblocks/Blockly.svelte';
  import { resizeStore } from '../stores/resize.store';
  import { stores, goto } from '@sapper/app';
  import authStore from '../stores/auth.store';
  import projectStore from '../stores/project.store';
  import { onErrorMessage } from '../help/alerts';
  import { getFile, getProject } from '../firebase/db';
  import { loadProject } from '../core/blockly/helpers/workspace.helper';
  import {
    arduinoLoopBlockShowLoopForeverText,
    arduinoLoopBlockShowNumberOfTimesThroughLoop,
  } from '../core/blockly/helpers/arduino_loop_block.helper';
  import swal from 'sweetalert';

  const { page } = stores();
  export let segment = '';

  let showScrollOnRightSide = false;

  // this controls whether the arduino start block show numbers of times in to execute the loop for the virtual circuit
  // or the loop forever text.  If segment is null that means we are home the home page and that is page that shows virtual circuit
  let showLoopExecutionTimesArduinoStartBlock;
  $: showLoopExecutionTimesArduinoStartBlock = isPathOnHomePage($page.path);

  let height = '500px';
  let middleFlex = 39;
  let rightFlex = 29;
  let leftFlex = 31;
  let isResizingLeft = false;
  let isResizingRight = false;

  /**
   * Event is on grabber on is trigger by a mouse down event
   */
  function startResize(side) {
    if (side == 'right') {
      isResizingRight = true;
    } else {
      isResizingLeft = true;
    }
  }

  /**
   * Event is on the body so that all mouse up events stop resizing
   */
  function stopResize() {
    isResizingRight = false;
    isResizingLeft = false;
  }

  const resize = (side) => {
    return (e) => {
      if (!isResizingLeft && side == 'left') {
        return;
      }

      if (!isResizingRight && side == 'right') {
        return;
      }

      // Width of the window
      const windowWidth = window.innerWidth;

      // If the either window size is less than 200 px don't resize window
      if (e.clientX < 20 || windowWidth - e.clientX < 20) {
        return;
      }

      // Because e.clientX represents the number of pixels the mouse is to the left
      // Subtract that from the total window size to get the width of the right side
      // Then divide that by total width and multiply by 100 to get the flex size
      // Subtract .5 for the size of the grabber which is 1 flex
      if (side == 'right') {
        rightFlex = ((windowWidth - e.clientX) / windowWidth) * 100;
      } else {
        console.log('firing left');
        leftFlex = (e.clientX / windowWidth) * 100;
      }

      // Derive the from right flex calculation
      middleFlex = 100 - rightFlex - leftFlex - 1;

      // Trigger an main windows that need to be resized
      resizeStore.mainWindow();
    };
  };

  /**
   * This is a mouse move event on the main section of the html
   * It will resize the 2 windows,
   * Slight Trottling with debounce
   */
  const resizeRightSide = _.debounce(resize('right'), 2);
  const resizeLeftSide = _.debounce(resize('left'), 2);

  function resizeHeight() {
    // Calculates the height of the window
    // We know that if it's  the home page that we want less height
    // for the main window because we want to display the player component
    const navBarHeight = 56;

    height = window.innerHeight - navBarHeight + 'px';
    // Hack to make sure everything update
    setTimeout(() => {
      resizeStore.mainWindow();
    }, 5);
  }

  onMount(() => {
    // Wrapped in an onMount because we don't want it executed by the server
    page.subscribe(({ path, params, query }) => {
      if (
        ['open', 'settings', 'lessons'].reduce((found, value) => {
          return found || path.indexOf(value) >= 0;
        }, false)
      ) {
        showScrollOnRightSide = true;
      } else {
        showScrollOnRightSide = false;
      }
      resizeHeight();
    });

    let loadedProject = false;
    if (localStorage.getItem('reload_once_workspace')) {
      const xmlText = localStorage.getItem('reload_once_workspace');
      localStorage.removeItem('reload_once_workspace');
      loadProject(xmlText);
      loadedProject = true;
    }

    firebase.auth().onAuthStateChanged(async (user) => {
      if (!user) {
        authStore.set({
          isLoggedIn: false,
          uid: null,
          firebaseControlled: true,
        });
        return;
      }

      authStore.set({
        isLoggedIn: true,
        uid: user.uid,
        firebaseControlled: true,
      });

      if (
        $projectStore.projectId === $page.query['projectid'] ||
        !$page.query['projectid'] ||
        loadedProject
      ) {
        return;
      }

      swal({
        title: 'Loading your project',
        allowEscapeKey: false,
        allowOutsideClick: false,
        onOpen: () => {
          (swal as any).showLoading();
        },
      } as any);

      const project = await getProject($page.query['projectid']);
      const file = await getFile($page.query['projectid'], $authStore.uid);
      loadProject(file);
      projectStore.set({ project, projectId: $page.query['projectid'] });
      if (isPathOnHomePage($page.path)) {
        arduinoLoopBlockShowNumberOfTimesThroughLoop();
      } else {
        arduinoLoopBlockShowLoopForeverText();
      }
      swal.close();
      return;
    });
  });
</script>

<Nav {segment} />
<svelte:body on:mouseup={stopResize} />
<main
  style="height: {height}"
  on:mousemove={resizeLeftSide}
  on:mousemove={resizeRightSide}
>
  <div style="flex: {leftFlex}; overflow-y: scroll;">
    <div class="lessons-container">
      <div id="close">X</div>

      <FormGroup>
        <Label for="search">Search</Label>
        <Input type="text" name="text" id="search" />
      </FormGroup>
      <FormGroup>
        <Label for="Category">Category</Label>
        <Input type="select" name="select" id="Category">
          <option>Lessons</option>
          <option>Starters</option>
          <option>How Tos</option>
          <option>All</option>
        </Input>
      </FormGroup>
      <h2>High Five Lesson</h2>
      <video controls>
        <source
          src="https://firebasestorage.googleapis.com/v0/b/inapp-tutorial.appspot.com/o/electroblocks-org%2FGcym9zmref566fEFWgYy%2Fstep_Vs5B6xqmI07XAXGNCs4n.mp4?alt=media&token=91ccea63-4d80-4b5d-a243-597eaf92ecea"
        />
      </video>
      <a href="http://www.google.com">High Five Wiring Instructions</a>

      <h2>Blink Lesson</h2>
      <video controls>
        <source
          src="https://firebasestorage.googleapis.com/v0/b/inapp-tutorial.appspot.com/o/electroblocks-org%2FGcym9zmref566fEFWgYy%2Fstep_Vs5B6xqmI07XAXGNCs4n.mp4?alt=media&token=91ccea63-4d80-4b5d-a243-597eaf92ecea"
        />
      </video>
      <a href="http://www.google.com">Blink Wiring Instructions</a>
    </div>
  </div>
  <div class="grabber" on:mousedown={() => startResize('left')} />
  <div style="flex: {middleFlex}" id="middle_panel">
    <Blockly {showLoopExecutionTimesArduinoStartBlock} />
  </div>
  <div on:mousedown={() => startResize('right')} class="grabber" />
  <div
    style="flex: {rightFlex}"
    class:scroll={showScrollOnRightSide}
    class:hide={rightFlex < 15}
    id="right_panel"
  >
    <slot />
  </div>
</main>

<svelte:window on:resize={resizeHeight} />

<!-- This means we are on the home page and need to display the player component -->
<style>
  /** the container of all the elements */
  main {
    width: 100%;
    display: flex;
    box-sizing: border-box; /** */
  }

  .lessons-container {
    padding: 15px;
    position: relative;
  }

  .lessons-container > video {
    width: calc(100% - 12px);

    display: block;
  }

  /** div used to resize both items */
  .grabber {
    flex: 1;
    cursor: col-resize;
    background-color: #eff0f1;
    background-position: center center;
    background-repeat: no-repeat;
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAeCAYAAADkftS9AAAAIklEQVQoU2M4c+bMfxAGAgYYmwGrIIiDjrELjpo5aiZeMwF+yNnOs5KSvgAAAABJRU5ErkJggg==);
  }
  #right_panel {
    overflow: hidden;
  }
  #right_panel.scroll {
    overflow-y: scroll;
  }
  .hide {
    opacity: 0.01;
  }
  #close {
    width: 20px;
    height: 20px;
    background-color: #aa0000;
    color: white;
    text-align: center;
    right: 0;
    top: 0;
    position: absolute;
    cursor: pointer;
    user-select: none;
  }
</style>
