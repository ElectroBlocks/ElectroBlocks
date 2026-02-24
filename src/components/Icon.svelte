<script>
  export let path;
  export let size = 24;
  export let color = 'currentColor';
  export let spinning = false;
</script>

<svg
  viewBox="0 0 24 24"
  width={size}
  height={size}
  fill={color}
  xmlns="http://www.w3.org/2000/svg"
  class:spinning
>
  <path d={path} />
</svg>

<style>
    svg {
        cursor: pointer;
    }
    
    .spinning {
        animation: spin 2s linear infinite;
    }
    
    @keyframes spin {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }
</style>
