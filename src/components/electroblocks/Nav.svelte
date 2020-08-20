<script>
  export let segment;
  import { upload } from "../../core/arduino/upload";
  import codeStore from "../../stores/code.store";
  import selectedBoard from "../../core/blockly/selectBoard";
  import arduionMessageStore from '../../stores/arduino-message.store';
  let isUploading = false;
  let code;

  $: uploadingClass = isUploading
    ? "fa-spinner fa-spin fa-6x fa-fw"
    : "fa-upload";
  codeStore.subscribe(newCode => {
    code = newCode;
  });

  async function uploadCode() {
    if (isUploading) {
      return;
    }
    isUploading = true;

    try {
      const avrgirl = new AvrgirlArduino({
        board: selectedBoard().type,
        debug: true,
      });

      console.log(await upload(code, avrgirl));
    } catch (e) {
      console.error(e, "error message");
      alert(
        "There was an error uploading your code.  Please check console for error messages."
      );
    }
    isUploading = false;
  }
</script>

<style>
  nav {
    height: 50px;
    width: 100%;
    overflow: auto;
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
  .fa-spinner {
    color: rgb(157, 153, 158) !important;
    pointer-events: none;
  }
  .disabled {
    cursor: not-allowed !important;
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
  <span class:disabled={isUploading}>
    <i
      on:click={uploadCode}
      class="fa {uploadingClass}"
      title="Upload code to arduino" />
  </span>
  <a href="/electroblocks/lessons" class:active={segment === 'lessons'}>
    <i class="fa fa-book" />
  </a>
  <a href="/electroblocks/file" class:active={segment === 'file'}>
    <i class="fa fa-file" />
  </a>

  <a href="/electroblocks/settings" class:active={segment === 'settings'}>
    <i class="fa fa-gears" />
  </a>

</nav>
