<script>
  import { goto } from "$app/navigation";
  function openLink(link) {
window.open(link, '_blank');  
}
</script>

<main class="container-fluid overflow-scroll mb-5 pb-5">
  <h1 class="mt-5">Arduino Lessons</h1>
  <hr />
  <div class="row g-2 g-lg-3">
    <div class="col-4" on:click={() => openLink('https://electroblocks.github.io/docs/lessons/lcd_screens/')}>
      <div class="card">
        <div class="card-body">
          <img
            loading="lazy"
            src="https://electroblocks.github.io/docs/assets/lcd_screen/lcd_screen.png"
            alt="difficulty-level"
            class="level"
          />
          <h3 class="card-title">LCD Screens</h3>
        </div>
      </div>
    </div>
    
    <div class="col-4">
      <div class="card">
        <div class="card-body">
          <img
            loading="lazy"
            src="https://electroblocks.github.io/docs/assets/lcd_screen/lcd_screen.png"
            alt="difficulty-level"
            class="level"
          />
          <h3 class="card-title">LCD Screens</h3>
        </div>
      </div>
    </div>    

    <div class="col-4">
      <div class="card">
        <div class="card-body">
          <img
            loading="lazy"
            src="https://electroblocks.github.io/docs/assets/lcd_screen/lcd_screen.png"
            alt="difficulty-level"
            class="level"
          />
          <h3 class="card-title">LCD Screens</h3>
        </div>
      </div>
    </div>    

  </div>
  <!-- {#each _.chunk(lessonList, 3) as lessonRow }
        <div class="row g-2 g-lg-3">
          {#each lessonRow as lesson }
          <div class="col-4">
            <div class="card" on:click={() => goToExample(`/?example_project=${lesson.file}`)}>
              <div class="card-body">
                <img loading="lazy" src={lesson.levelImage} alt="difficulty-level" class="level">
                <h5 class="card-title">{lesson.title}</h5>
              </div>
              <img src={lesson.image} class="card-img-bottom" alt={lesson.title}>
            </div>
          </div>
          
          {/each}
        </div>
      {/each} -->
</main>

<style>
  .container-fluid {
    height: 99vh;
    width: 90vw;
  }

  img {
    width: 100%;
    height: 40vh;
    object-fit: cover;
  }
  .card-body {
    position: relative;
  }
  .card {
    cursor: pointer;
  }
  
  h3 {
    text-align: center;
    margin-top: 20px;
  }
</style>
