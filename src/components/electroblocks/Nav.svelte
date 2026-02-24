<script lang="ts">
  const navTooltipStyle = {
    position: "bottom",
    align: "center",
    animation: "slide",
    theme: "nav-tooltip",
  };
  import authStore from "../../stores/auth.store";
  import projectStore from "../../stores/project.store";
  import { isPathOnHomePage } from "../../helpers/is-path-on-homepage";
  import { fade } from "svelte/transition";
  import { logout } from "../../firebase/auth";
  import { resetWorkspace } from "../../core/blockly/helpers/workspace.helper";
  import { saveProject } from "../../firebase/db";
  import { wait } from "../../helpers/wait";
  import { onConfirm, onErrorMessage } from "../../help/alerts";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { tooltip } from "@svelte-plugins/tooltips";
  import Icon from "../Icon.svelte";
  import { mdiCarSettings, mdiCodeBraces, mdiCodeBracesBox, mdiCogOutline, mdiDownload, mdiFile, mdiFloppy, mdiFolder, mdiFolderOpen, mdiGaugeEmpty, mdiInformation, mdiLightningBolt, mdiLogin, mdiLogout, mdiMemory, mdiMonitor, mdiWrench } from "@mdi/js";
  
  let canSave = true;
  let showSaveSuccess = false;
  let params = "";

  projectStore.subscribe((p) => {
    if (p.projectId) {
      params = `?projectid=${p.projectId}`;
    } else {
      params = "";
    }
  });

  async function onNewFileAuth() {
    if (!$projectStore.project) {
      onNewFileNoAuth();
      return;
    }

    const confirmNewFile = await onConfirm(
      "We are about to save your current project and create a new one? Would you like to continue?"
    );

    if (!confirmNewFile) {
      return;
    }
    try {
      await saveProject($projectStore.project, $projectStore.projectId);
      projectStore.set({ projectId: null, project: null });
      await goto("/");
      resetWorkspace();
    } catch (e) {
      onErrorMessage("Error saving your project please try agian.", e);
    }
  }

  async function onNewFileNoAuth() {
    const confirmNewFile = await onConfirm(
      "You are creating a new file, which will delete your work.  Would you like to continue?"
    );
    if (!confirmNewFile) {
      return;
    }

    resetWorkspace();
  }

  async function onSaveClick() {
    if (!$projectStore.projectId) {
      await goto("/project-settings");
      return;
    }

    if (!canSave) return;
    try {
      await saveProject($projectStore.project, $projectStore.projectId);
      showSaveSuccess = true;
      await wait(1500);
      canSave = true;
      showSaveSuccess = false;
    } catch (e) {
      onErrorMessage("Error saving your project please try agian.", e);
    }
  }

  async function onSignOut() {
    try {
      await logout();
    } catch (e) {
      onErrorMessage("Please try again in 5 minutes", e);
    }
  }

</script>

<nav class:small={!$authStore.isLoggedIn}>
  <a href="/" class="logos">
    <img class="electroblocks" src="/logo.png" alt="">
    <img class="fossee" src="/fossee.png" alt="">
  </a>
  {#if $authStore.isLoggedIn}
    <a
      title="Home"
      use:tooltip={navTooltipStyle}
      href="/{params}"
      class:active={isPathOnHomePage($page.url.pathname)}
    >
    <Icon path={mdiMonitor} size={50} />
    </a>

    <a
      href="/code{params}"
      title="Code"
      use:tooltip={navTooltipStyle}
      class:active={$page.url.pathname.includes("code")}
    >
      <Icon path={mdiCodeBraces} size={50} />
    </a>
    <a
      href="/arduino{params}"
      use:tooltip={navTooltipStyle}
      title="Upload"
      class:active={$page.url.pathname.includes("arduino")}
    >
          <Icon path={mdiMemory} size={50} />
    </a>

    <a
      href="/open"
      use:tooltip={navTooltipStyle}
      title="My Projects"
      class:active={$page.url.pathname.includes('open')}
    >
            <Icon path={mdiFolderOpen} size={50} />

    </a>
    <span
      title="New File/Blank File"
      use:tooltip={navTooltipStyle}
      on:click={onNewFileAuth}
    >
          <Icon path={mdiFile} size={50} />
    </span>
    <span
      title="Save Project"
      use:tooltip={navTooltipStyle}
      on:click={onSaveClick} >
          <Icon path={mdiFloppy} size={50} />
          </span>
    <a
      title="Project Settings"
      href="/project-settings"
      use:tooltip={navTooltipStyle}
      class:active={$page.url.pathname.includes("project-settings")}
    >
          <Icon path={mdiWrench} size={50} />
    </a>
    <a
      title="Settings"
      use:tooltip={navTooltipStyle}
      href="/settings"
      class:active={$page.url.pathname.includes('/settings')}
    >
      <Icon path={mdiCogOutline} size={50} />
    </a>
    <span use:tooltip={navTooltipStyle} on:click={onSignOut} title="Sign Out">
          <Icon path={mdiLogout} size={50} />
    </span>
  {/if}

  {#if !$authStore.isLoggedIn}
    <a
      href="/"
      title="Simulator"
      use:tooltip={navTooltipStyle}
      class:active={isPathOnHomePage($page.url.pathname)}
    >
    <Icon path={mdiMonitor} size={50} />
      <!-- <i class="fa-solid fa-desktop" /> -->
    </a>

    <a
      href="/code"
      title="Code"
      use:tooltip={navTooltipStyle}
      class:active={$page.url.pathname.includes("code")}
    >
      <Icon path={mdiCodeBraces} size={50} />

      <!-- <i class="fa-solid fa-code" /> -->
    </a>
    <a
      href="/arduino"
      use:tooltip={navTooltipStyle}
      title="Upload"
      class:active={$page.url.pathname.includes("arduino")}
    >
          <Icon path={mdiMemory} size={50} />

      <!-- <i class="fa-solid fa-microchip" /> -->
    </a>

    <a
      href="/open"
      use:tooltip={navTooltipStyle}
      title="Projects"
      class:active={$page.url.pathname.includes("open")}
    >
      <!-- <i
        class="fa-folder-open"
        class:fa-regular={!$page.url.pathname.includes("open")}
        class:fa-solid={$page.url.pathname.includes("open")}
      /> -->
      <Icon path={mdiFolderOpen} size={50} />

    </a>
    <span
      use:tooltip={navTooltipStyle}
      title="New File/Blank File"
      on:click={onNewFileNoAuth}
      class="active"
    >
          <Icon path={mdiFile} size={50} />

      <!-- <i class="fa-regular fa-file" /> -->
    </span>
    <a
      href="/download"
      use:tooltip={navTooltipStyle}
      title="Download"
      class:active={$page.url.pathname.includes("download")}
    >
              <Icon path={mdiDownload} size={50} />

      <!-- <i class="fa-solid fa-download" /> -->
    </a>
    <a
      href="/settings"
      use:tooltip={navTooltipStyle}
      title="Settings"
      class:active={$page.url.pathname.includes("settings")}
    >
      <Icon path={mdiCogOutline} size={50} />
      <!-- <i class="fa-solid fa-gears" /> -->
    </a>
    <a
      href="/login"
      use:tooltip={navTooltipStyle}
      title="Login"
      class:active={$page.url.pathname.includes("login")}
    >
      <Icon path={mdiLogin} size={50} />

      <!-- <i class="fa-solid fa-sign-in" /> -->
    </a>
  {/if}
  <a
      title="About"
      use:tooltip={navTooltipStyle}
      href="/about"
      class:active={$page.url.pathname.includes("about")}
    >
      <Icon path={mdiInformation} size={50} />

      <!-- <i class="fa-solid fa-info-circle" /> -->
    </a>
</nav>
{#if showSaveSuccess}
  <p transition:fade id="saved">project saved</p>
{/if}

<style>
  nav {
    width: 100%;
    border-bottom: 1px solid gray;
    height: 56px;
  }
  
  img {
    max-height: 49px;
  }
  img.electroblocks {
    max-width: 30%;
  }
  img.fossee {
    max-width: 60%;
  }

  nav .fa-solid, nav .fa-light, nav .fa-solid, nav * {
    /* color: #505bda; */
    color: red;
  }
  
  

  nav a i{    
    opacity: 0.5;
  }

  nav .active i {
    color: #505bda !important;
    opacity: 1;
  }

  nav .active {
    color: #505bda !important;
    opacity: 1;
  }

  nav a,
  nav span {
    float: left;
    width: calc((100% - 170px) / 10);
    text-align: center;
    padding: 2px 0;
    transition: all 0.3s ease;
    color: #858ddc;
    font-size: 3rem;
    cursor: pointer;
    line-height: 1px;
    margin-bottom: 0;
    margin-top: 3px;
  }
  nav.small a,
  nav.small span {
    width: calc((100% - 170px) / 9);
  }
  .logos {
    width: 170px!important;
    color: transparent;
  }
  #saved {
    position: absolute;
    left: 50%;
    top: 100px;
    background: #2c75e6;
    text-align: center;
    vertical-align: middle;
    padding: 10px;
    transform: translateX(-50%);
    z-index: 21;
    color: #fff;
  }

  :global(.tooltip.nav-tooltip) {
    margin-top: 42px;
    z-index: 1000;
  }
</style>
