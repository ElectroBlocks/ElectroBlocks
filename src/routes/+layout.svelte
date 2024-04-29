<script lang="ts">
  import { onMount, tick } from 'svelte';
  import _ from 'lodash';
  import { getAuth, onAuthStateChanged } from 'firebase/auth';
  import config from '../env';
  import { isPathOnHomePage } from '../helpers/is-path-on-homepage';
  import Nav from '../components/electroblocks/Nav.svelte';
  import Blockly from '../components/electroblocks/Blockly.svelte';
  import { resizeStore } from '../stores/resize.store';
  import { page } from '$app/stores';
  import authStore from '../stores/auth.store';
  import projectStore from '../stores/project.store';
  import { getFile, getProject } from '../firebase/db';
  import { loadProject } from '../core/blockly/helpers/workspace.helper';
  import showLessonStore from '../stores/showLessons.store';
  import {
    arduinoLoopBlockShowLoopForeverText,
    arduinoLoopBlockShowNumberOfTimesThroughLoop,
  } from '../core/blockly/helpers/arduino_loop_block.helper';
  import swal from 'sweetalert';
  import Lessons from '../components/electroblocks/home/Lessons.svelte';
  import { initializeAnalytics } from 'firebase/analytics';
  import { initializeApp } from 'firebase/app';

  export let segment = '';

  let showScrollOnRightSide = false;

  // this controls whether the arduino start block show numbers of times in to execute the loop for the virtual circuit
  // or the loop forever text.  If segment is null that means we are home the home page and that is page that shows virtual circuit
  let showLoopExecutionTimesArduinoStartBlock: boolean;
  $: showLoopExecutionTimesArduinoStartBlock = isPathOnHomePage($page.url.pathname);

  let height = '500px';
  let middleFlex = 59.5;
  let rightFlex = 39.5;
  let leftFlex = 0;
  let isResizingLeft = false;
  let isResizingRight = false;

  /**
   * Event is on grabber on is trigger by a mouse down event
   */
  function startResize(side: string) {
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

  const resize = (side: string) => {
    return (e : MouseEvent) => {
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
        leftFlex = (e.clientX / windowWidth) * 100;
      }

      // If this is false we should not worry about lesson side of the screen.
      if (!$showLessonStore) {
        leftFlex = 0;
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
    // Initialize Firebase
    const app = initializeApp(config.firebase);
    initializeAnalytics(app);

    localStorage.removeItem('no_alert');
    // Wrapped in an onMount because we don't want it executed by the server
    page.subscribe(({ url }) => {
      if (
        ['open', 'settings', 'lessons', 'code'].reduce((found, value) => {
          return found || url.pathname.indexOf(value) >= 0;
        }, false)
      ) {
        showScrollOnRightSide = true;
      } else {
        showScrollOnRightSide = false;
      }
      resizeHeight();
    });

    showLessonStore.subscribe(async (showLesson) => {
      if (showLesson) {
        middleFlex = 39;
        rightFlex = 29;
        leftFlex = 31;
      } else {
        middleFlex = 59.5;
        rightFlex = 39.5;
        leftFlex = 0;
      }
      await tick();
      await tick();
      await tick();
      resizeStore.mainWindow();
    });

    let loadedProject = false;
    if (localStorage.getItem('reload_once_workspace')) {
      const xmlText = localStorage.getItem('reload_once_workspace');
      localStorage.removeItem('reload_once_workspace');
      loadProject(xmlText);
      loadedProject = true;
    }
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
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
        $projectStore.projectId === $page.url.searchParams.get('projectid') ||
        !$page.url.searchParams.get('projectid') ||
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

      const project = await getProject($page.url.searchParams.get('projectid'));
      const file = await getFile($page.url.searchParams.get('projectid'), $authStore.uid);
      loadProject(file);
      projectStore.set({ project, projectId: $page.url.searchParams.get('projectid') });
      if (isPathOnHomePage($page.url.pathname)) {
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
  {#if $showLessonStore}
    <div style="flex: {leftFlex}; overflow-y: scroll;">
      <Lessons />
    </div>
    <div class="grabber" on:mousedown={() => startResize('left')} />
  {/if}
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
</style>
