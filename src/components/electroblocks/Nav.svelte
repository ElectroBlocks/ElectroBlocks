<script lang="ts">

  export let segment: string;
  import authStore from '../../stores/auth.store';
  import projectStore from '../../stores/project.store';
  import { isPathOnHomePage } from '../../helpers/is-path-on-homepage';
  import { stores, goto } from "@sapper/app";
  import { logout } from '../../firebase/auth';
  import { loadNewProjectFile } from '../../helpers/open-project-file';
import { arduinoLoopBlockShowLoopForeverText, arduinoLoopBlockShowNumberOfTimesThroughLoop } from '../../core/blockly/helpers/arduino_loop_block.helper';
import { resetWorkspace } from '../../core/blockly/helpers/workspace.helper';
import { saveProject } from '../../firebase/db';
  let isOpeningFile = false;
  let fileUpload;

  const { page, session } = stores();

  let urlProject = '/';
  let urlProjectHome =   '/';
  projectStore.subscribe(p => {
    urlProjectHome = p.projectId ? `/project/${p.projectId}` : '/';
    urlProject = p.projectId ? `/project/${p.projectId}/` : '/';
  })

  async function onNewFileAuth() {
      if (!$projectStore.project) {
        onNewFileNoAuth();
        return;
      }

      const confirmNewFile = confirm('We are about to save your current project and create a new one? Would you like to continue?');

      if (!confirmNewFile) {
        return;
      }

     await saveProject($projectStore.project, $projectStore.projectId);
     await goto("/");
     resetWorkspace();
  }

  function onNewFileNoAuth() {
    const confirmNewFile = confirm('You are creating a new file, which will delete your work.  Would you like to continue?');

    if (!confirmNewFile) {
      return;
    }

    resetWorkspace();
    
  }
  

  async function onSignOut() {
    await logout();
  }

 async function openFile(e) {
    isOpeningFile = true;
    const file = fileUpload.files[0];
    if (!file) {
      return
    }

    try {
        await loadNewProjectFile(file);
    } catch (e) {
        alert('Error loading the project file please make sure that it is valid.');
    }

    isOpeningFile = false;
    if (isPathOnHomePage($page.path)) {
      arduinoLoopBlockShowNumberOfTimesThroughLoop();
    } else {
      arduinoLoopBlockShowLoopForeverText();
    }
}
  
</script>

<style>
  nav {
    height: 50px;
    width: 100%;
    overflow: auto;
    border-bottom: 1px solid gray;
  }

  nav .fa {
    color: #505bda;
  }

  nav a .fa,
  nav .disabled .fa {
    opacity: 0.5;
  }

  nav .active .fa {
    color: #505bda !important;
    opacity: 1;
  }

  nav a,
  nav span, label {
    float: left;
    width: 10%;
    text-align: center;
    padding: 2px 0;
    transition: all 0.3s ease;
    color: white;
    font-size: 30px;
    cursor: pointer;
  }
  nav.small a, nav.small span, nav.small label {
    width: 11.11111%
  }
</style>

<nav class:small={!$authStore.isLoggedIn} >
  {#if $authStore.isLoggedIn }
  <a href="{urlProjectHome}" class:active={isPathOnHomePage($page.path)}>
    <i class="fa fa-home" />
  </a>

  <a href="{urlProject}code" class:active={$page.path.includes('code')}>
    <i class="fa fa-code" />
  </a>
  <a href="{urlProject}arduino" class:active={$page.path.includes('arduino')}>
    <i class="fa fa-microchip" />
  </a>
  <a href="/lessons" class:active={segment === 'lessons'}>
    <i class="fa fa-book" />
  </a>
  <a href="/open" class:active={segment === 'open'}>
    <i class="fa " class:fa-folder-open-o={segment !== 'open'} class:fa-folder-open={segment === 'open'} />
  </a>
  <span on:click={onNewFileAuth} >
    <i class="fa fa-file-o"></i>
  </span>
  <span ><i class="fa fa-floppy-o"></i></span>
    <span>
      <i class="fa fa-wrench" aria-hidden="true"></i>
    </span>
    <a href="/settings" class:active={segment === 'settings'}>
    <i class="fa fa-gears" />
  </a>
   <span on:click={onSignOut}>
    <i class="fa fa-sign-out" title="Sign Out" aria-hidden="true"></i>
  </span>
  {/if}

  {#if !$authStore.isLoggedIn}
    <a href="{urlProjectHome}" class:active={isPathOnHomePage($page.path)}>
      <i class="fa fa-home" />
    </a>

  <a href="{urlProject}code" class:active={$page.path.includes('code')}>
    <i class="fa fa-code" />
  </a>
  <a href="{urlProject}arduino" class:active={$page.path.includes('arduino')}>
    <i class="fa fa-microchip" />
  </a>
  <a href="/lessons" class:active={segment === 'lessons'}>
    <i class="fa fa-book" />
  </a>
  <label class:active={segment === 'open'}>
    <i class="fa " class:fa-folder-open-o={!isOpeningFile} class:fa-folder-open={isOpeningFile} />
    <input on:change={openFile} type="file"  accept="text/xml" style="display:none" bind:this={fileUpload}/>
  </label>
  <span on:click={onNewFileNoAuth} class="active">
    <i class="fa fa-file-o"></i>
  </span>
  <a href="/download" class:active={segment === 'download'}>
    <i class="fa fa-download" />
  </a>
  <a href="/settings" class:active={segment === 'settings'}>
    <i class="fa fa-gears" />
  </a>
   <a href="/login" class:active={segment === 'login'}>
    <i class="fa fa-sign-in" />
  </a>
  {/if}

 

  
</nav>
