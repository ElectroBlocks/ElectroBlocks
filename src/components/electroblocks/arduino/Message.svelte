
<script>

  function sendMessage() {
    console.log('send send');
  }
</script>
<style>
  #message {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  #messages {
    flex: 4;
    padding: 10px;
    font-size: 18px;
  }
  #messages p img{
    vertical-align: middle;
  }
  #send-message-container {
    display: flex;
    justify-content: space-between;
    width: 98%;
    margin: auto;
  }
  #send-message-container form {
    flex: 4;
  }
  #send-message-container input{
    width: 98%;
    margin: 5px;
    outline: none;
    border: none;
    font-size: 25px; 
    height: 40px;
    border-bottom: 1px solid purple;
    transition: linear 1s border-bottom;
  }
  #send-message-container input:active,#send-message-container input:focus {
    outline: none;
    border-bottom: 2px solid purple;
  } 
   button {
    margin: 5px;  
    border: none;
     border-radius: 2px;
    font-size: 20px;
    padding: 0 10px;
    width: 50px;
    height: 40px;
    margin-top: 10px;
    cursor: pointer;
  }
  button i {
    transition: ease-in-out .4s font-size;
  }
  button:focus, button:active {
    outline: none;
  }
  button:active i {
    font-size: 18px;
  }
  button:disabled {
    cursor: not-allowed;
    background-color: rgb(251, 251, 247);
  }
  button:disabled i {
    font-size: 20px;
  }
</style>

<div  id="message">
  <section id="messages">
    <article class="message-computer">
      <p>
        <img src="/laptop.png" alt="computer">
        Hello I am a computer
      </p>
    </article>
    <article class="message-arduion">
      <p>
        <img src="/cpu.png" alt="computer">
        Hello I am a arduino
      </p>
    </article>
  </section>
  <section id="send-message-container">
    <form on:submit|preventDefault={sendMessage}>
      <input type="text" placeholder="Send a message to Arduino" />
    </form>
    <button><i on:click={sendMessage} class="fa fa-paper-plane"></i></button>
    <!-- <button><i  class="fa fa-close"></i></button> -->
    <button><i class="fa fa-usb"></i></button>

    <button disabled><i class="fa fa-upload"></i></button>
    <button><i class="fa fa fa-trash"></i></button>
  </section>
</div>