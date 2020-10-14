<script lang="ts">
  export let segment: string;
  import userStore from '../../stores/user.store';

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
    width: 14.285714%;
    text-align: center;
    padding: 2px 0;
    transition: all 0.3s ease;
    color: white;
    font-size: 30px;
    cursor: pointer;
  }
</style>

<nav>
  <a href="/" class:active={segment === '' || segment === undefined}>
    <i class="fa fa-home" />
  </a>

  <a href="/code" class:active={segment === 'code'}>
    <i class="fa fa-code" />
  </a>
  <a href="/arduino" class:active={segment === 'arduino'}>
    <i class="fa fa-microchip" />
  </a>
  <a href="/lessons" class:active={segment === 'lessons'}>
    <i class="fa fa-book" />
  </a>
  <a href="/projects" class:active={segment === 'projects'}>
    <i class="fa " class:fa-folder-open-o={segment !== 'projects'} class:fa-folder-open={segment === 'projects'} />
  </a>
  <span> <i class="fa " class:fa-download={!$userStore} class:fa-floppy-o={$userStore} /> </span>
  <!-- <span> <i class="fa  fa-floppy-o" /> </span> -->
  <a href="/settings" class:active={segment === 'settings'}>
    <i class="fa fa-gears" />
  </a>
</nav>
