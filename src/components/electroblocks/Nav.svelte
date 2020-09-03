<script>
  export let segment;
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
  <a
    href="/electroblocks"
    class:active={segment === '' || segment === undefined}>
    <i class="fa fa-home" />
  </a>

  <a href="/electroblocks/code" class:active={segment === 'code'}>
    <i class="fa fa-code" />
  </a>
  <a href="/electroblocks/arduino" class:active={segment === 'arduino'}>
    <i class="fa fa-microchip" />
  </a>
  <a href="/electroblocks/lessons" class:active={segment === 'lessons'}>
    <i class="fa fa-book" />
  </a>
  <a href="/electroblocks/file" class:active={segment === 'file'}>
    <i class="fa fa-folder-open" />
  </a>
  <span> <i class="fa fa-download" /> </span>
  <a href="/electroblocks/settings" class:active={segment === 'settings'}>
    <i class="fa fa-gears" />
  </a>
</nav>
