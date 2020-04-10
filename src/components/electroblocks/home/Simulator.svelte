<script>
  import currentState from "../../../stores/currentState.store";
  let state;
  currentState.subscribe(currentState => {
    state = currentState;
  });
</script>

<style>
  #simulator {
    width: 100%;
    height: 100%;
    background-color: brown;
  }
</style>

<div id="simulator">
  <h2>{state ? state.explanation : 'nothing'}</h2>
</div>
