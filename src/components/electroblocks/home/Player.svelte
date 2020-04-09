<script lang="typescript">
  
  import stateStore from "../../../stores/state.store";
  let frames = [];
  stateStore.subscribe(newFrames => {
    frames = newFrames;
  });

</script>

<style>
  #slide-container {
    width: 100%;
    height: 35px;
    z-index: 100;
  }

  .slider {
    -webkit-appearance: none;
    width: 100%;
    height: 25px;
    background: #d3d3d3;
    outline: none;
    opacity: 0.7;
    -webkit-transition: 0.2s;
    transition: opacity 0.2s;
  }

  .slider:hover {
    opacity: 1;
  }

  .slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 25px;
    height: 25px;
    background: #505bda;
    cursor: pointer;
  }

  .slider::-moz-range-thumb {
    width: 25px;
    height: 25px;
    background: #505bda;
    cursor: pointer;
  }

  #video-controls-container span {
    padding: 0;
  }
  #video-controls-container label {
    font-size: 30px;
    font-family: "Biryani", Arial, Helvetica, sans-serif;
    color: #505bda;
    font-weight: 600;
  }
  #video-controls-container input {
    margin-top: 10px;
    padding: 1px;
    margin-left: 10px;
    height: 20px;
    font-size: 16px;
    vertical-align: top;
  }

  #video-controls-container span i.fa {
    color: #505bda;
    opacity: 1;
  }

  #video-controls-container.disable {
    cursor: not-allowed;
  }

  #video-controls-container span.disable {
    pointer-events: none;
  }

  #video-controls-container span.disable i.fa {
    color: #505bda;
    opacity: 0.5;
    cursor: not-allowed;
  }

  #video-controls-container > button {
    padding: 5px;
    border-radius: 5px;
    margin-left: 20px;
  }

  .icon-bar {
    width: 100%;
    overflow: auto;
  }

  .icon-bar .fa {
    color: #505bda;
    opacity: 0.5;
    cursor: pointer;
  }

  .icon-bar .active .fa {
    color: #505bda !important;
    opacity: 1;
  }

  .icon-bar span:first-of-type {
    margin-left: 15%;
  }

  .icon-bar span {
    float: left;
    width: 10%;
    text-align: center;
    padding: 12px 0;
    transition: all 0.3s ease;
    color: white;
    font-size: 36px;
  }

  .icon-bar-bottom span,
  .icon-bar-bottom span {
    float: right;
  }

  .slider {
    -webkit-appearance: none;
    width: 100%;
    height: 25px;
    background: #d3d3d3;
    outline: none;
    opacity: 0.7;
    -webkit-transition: 0.2s;
    transition: opacity 0.2s;
  }

  .slider:hover {
    opacity: 1;
  }

  .slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 25px;
    height: 25px;
    background: #505bda;
    cursor: pointer;
  }

  .slider::-moz-range-thumb {
    width: 25px;
    height: 25px;
    background: #505bda;
    cursor: pointer;
  }

  .menu-section {
    display: inline-block;
    margin-right: 25px;
  }

  #speed-control {
    vertical-align: top;
    text-align: left;
    width: 30%;
  }

  #frameInfo {
    width: 25%;
  }

  input:invalid {
    box-shadow: none;
  }
</style>

<div id="slide-container">
  <input
    type="range"
    min="0"
    max={frames.length}
    class="slider"
    id="scrub-bar" />
</div>
<div id="video-controls-container" class="icon-bar">
  <span id="video-debug-backward">
    <i class="fa fa-backward" />
  </span>
  <span id="video-debug-play">
    <i class="fa fa-play" />
  </span>

  <span id="video-debug-forward">
    <i class="fa fa-forward" />
  </span>

  <div id="speed-control" class="menu-section">
    <label for="speed">Speed:</label>
    <input id="speed" type="range" min="1" max="10" value="1" />
  </div>
  <span>
    <i class="fa fa-repeat" />
  </span>
</div>
