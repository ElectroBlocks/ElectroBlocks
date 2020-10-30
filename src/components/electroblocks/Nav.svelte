<script lang="ts">

  export let segment: string;
  import authStore from '../../stores/auth.store';
  import projectStore from '../../stores/project.store';
  import { stores } from "@sapper/app";

  const { page, session } = stores();

  let urlProject = '/';
  let urlProjectHome =   '/';
  projectStore.subscribe(p => {
    urlProjectHome = p.projectId ? `/project/${p.projectId}` : '/';
    urlProject = p.projectId ? `/project/${p.projectId}/` : '/';
  })

  function isPathOnHomePage(path) {
    if (path === "/") {
      return true;
    }

    const pathParts = path.split("/").slice(1);
   
    return pathParts.length === 2 && pathParts[0] === "project"
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
  nav span {
    float: left;
    width: 10%;
    text-align: center;
    padding: 2px 0;
    transition: all 0.3s ease;
    color: white;
    font-size: 30px;
    cursor: pointer;
  }
  nav.small a, nav.small span {
    width: 12.5%
  }
</style>

<nav class:small={!$authStore.isLoggedIn}>
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
  <a href="/projects" class:active={segment === 'projects'}>
    <i class="fa " class:fa-folder-open-o={segment !== 'projects'} class:fa-folder-open={segment === 'projects'} />
  </a>
  {#if $authStore.isLoggedIn}
    <span><i class="fa fa-floppy-o"></i></span>
  {/if}

  <span>
    <i class="fa fa-download"></i>
  </span>
  <span>
    <i class="fa fa-file-o"></i>
  </span>
  {#if $authStore.isLoggedIn}
  <span>
    <i class="fa fa-wrench" aria-hidden="true"></i>
  </span>
  {/if}
  <a href="/settings" class:active={segment === 'settings'}>
    <i class="fa fa-gears" />
  </a>
</nav>
