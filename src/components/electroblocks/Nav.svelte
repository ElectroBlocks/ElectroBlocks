<script>
  export let segment;
</script>

<style>
  #bottom-menu {
    height: 50px;
    width: 100%;
    overflow: auto;
  }

  #bottom-menu .fa {
    color: #505bda;
  }

  #bottom-menu a .fa,
  #bottom-menu .disabled .fa {
    opacity: 0.5;
  }

  #bottom-menu .active .fa {
    color: #505bda !important;
    opacity: 1;
  }

  #bottom-menu a,
  #bottom-menu span {
    float: left;
    width: 14.285714%;
    text-align: center;
    padding: 2px 0;
    transition: all 0.3s ease;
    color: white;
    font-size: 30px;
    cursor: pointer;
  }

  .fa-exclamation-triangle {
    color: rgb(248, 166, 166) !important;
  }
</style>

<nav id="bottom-menu">
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
    <i class="fa fa-file" />
  </a>

  <a href="/electroblocks/settings" class:active={segment === 'settings'}>
    <i class="fa fa-gears" />
  </a>
  <span>
    <i class="fa fa-exclamation-triangle" />
  </span>

</nav>
