<script lang="ts">
  import { onMount } from "svelte";
  import _ from "lodash";
  import firebase from "firebase/app";

  import { isPathOnHomePage } from "../helpers/is-path-on-homepage";
  import Nav from "../components/electroblocks/Nav.svelte";
  import Blockly from "../components/electroblocks/Blockly.svelte";
  import Player from "../components/electroblocks/home/Player.svelte";
  import { resizeStore } from "../stores/resize.store";
  import { stores, goto } from "@sapper/app";
  import authStore from "../stores/auth.store";
  import projectStore from "../stores/project.store";
  import { onErrorMessage } from "../help/alerts";
  import { getFile, getProject } from "../firebase/db";
  import { loadProject } from "../core/blockly/helpers/workspace.helper";
  import {
    arduinoLoopBlockShowLoopForeverText,
    arduinoLoopBlockShowNumberOfTimesThroughLoop,
  } from "../core/blockly/helpers/arduino_loop_block.helper";
  import swal from "sweetalert";

  const { page } = stores();
  export let segment = "";

  let isOnHomePage = false;
  // this controls whether the arduino start block show numbers of times in to execute the loop for the virtual circuit
  // or the loop forever text.  If segment is null that means we are home the home page and that is page that shows virtual circuit
  let showLoopExecutionTimesArduinoStartBlock;
  $: showLoopExecutionTimesArduinoStartBlock = isPathOnHomePage($page.path);

  let height = "500px";
  let leftFlex = 49;
  let rightFlex = 49;
  let isResizing = false;

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
  const resize = _.debounce((e) => {
    if (!isResizing) {
      return;
    }

    // Width of the window
    const windowWidth = window.innerWidth;

    // If the either window size is less than 200 px don't resize window
    if (e.clientX < 200 || windowWidth - e.clientX < 200) {
      return;
    }

    // Because e.clientX represents the number of pixels the mouse is to the left
    // Subtract that from the total window size to get the width of the right side
    // Then divide that by total width and multiply by 100 to get the flex size
    // Subtract .5 for the size of the grabber which is 1 flex
    rightFlex = ((windowWidth - e.clientX) / windowWidth) * 100 - 0.5;

    // Derive the from right flex calculation
    leftFlex = 100 - rightFlex - 0.5;

    // Trigger an main windows that need to be resized
    resizeStore.mainWindow();
  }, 2);

  onMount(() => {
    // Wrapped in an onMount because we don't want it executed by the server
    page.subscribe(({ path, params, query }) => {
      console.log(path, "path", params);
      isOnHomePage = isPathOnHomePage(path);
      // Calculates the height of the window
      // We know that if it's  the home page that we want less height
      // for the main window because we want to display the player component
      const subtractSpace = isOnHomePage ? 140 : 50;
      height = window.innerHeight - subtractSpace + "px";
      // Hack to make sure everything update
      setTimeout(() => {
        resizeStore.mainWindow();
      }, 5);
    });
    let loadedProject = false;
    if (localStorage.getItem("reload_once_workspace")) {
      const xmlText = localStorage.getItem("reload_once_workspace");
      localStorage.removeItem("reload_once_workspace");
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
        $projectStore.projectId === $page.query["projectid"] ||
        !$page.query["projectid"] ||
        loadedProject
      ) {
        return;
      }

      swal({
        title: "Loading your project",
        allowEscapeKey: false,
        allowOutsideClick: false,
        onOpen: () => {
          (swal as any).showLoading();
        },
      } as any);

      const project = await getProject($page.query["projectid"]);
      const file = await getFile($page.query["projectid"], $authStore.uid);
      loadProject(file);
      projectStore.set({ project, projectId: $page.query["projectid"] });
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
<main style="height: {height}" on:mousemove={resize}>
  <div style="flex: {leftFlex}" id="left_panel">
    <Blockly {showLoopExecutionTimesArduinoStartBlock} />
  </div>
  <div on:mousedown={startResize} id="grabber" />
  <div style="flex: {rightFlex}" id="right_panel">
    <slot />
  </div>
</main>

<!-- This means we are on the home page and need to display the player component -->

{#if isOnHomePage}
  <Player />
{/if}

<style>
  /** the container of all the elements */
  main {
    width: 100%;
    display: flex;
    box-sizing: border-box; /** */
  }

  /** div used to resize both items */
  #grabber {
    flex: 1;
    cursor: col-resize;
    background-color: #eff0f1;
    background-position: center center;
    background-repeat: no-repeat;
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAeCAYAAADkftS9AAAAIklEQVQoU2M4c+bMfxAGAgYYmwGrIIiDjrELjpo5aiZeMwF+yNnOs5KSvgAAAABJRU5ErkJggg==);
  }
  #right_panel {
    overflow-y: scroll;
  }
</style>
