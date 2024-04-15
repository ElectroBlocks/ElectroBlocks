<script>
  import Login from "../../components/auth/Login.svelte";
</script>

<h1>Login Options</h1>

<Login />

<p>
  We might include more options in the future, but for now we are sticking with
  google.
</p>
<svelte:head>
  <title>ElectroBlocks - Login</title>
</svelte:head>

<style>
  h1 {
    text-align: center;
    margin-top: 20px;
  }
  p {
    width: 80%;
    margin-left: 10%;
    text-align: center;
    margin-top: 20px;
  }
</style>
