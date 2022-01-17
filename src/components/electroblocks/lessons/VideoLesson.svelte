<script lang="ts">
  import type { VideoLesson } from '../../../lessons/lessons';
  export let lesson: VideoLesson;
</script>

<div class="lesson">
  <h2 id="lesson-video-{lesson.id}">{lesson.title}</h2>
  <video controls>
    <track kind="captions" />
    <source src={lesson.videoUrl} />
  </video>
  <a target="_blank" href={lesson.lessonUrl}>Support Page</a>
</div>

<style>
  .lesson {
    border-bottom: solid gray 1px;
    padding: 2px;
    margin-bottom: 20px;
  }
  video {
    width: 100%;
    display: block;
  }
  a {
    display: block;
    color: darkblue;
    text-decoration: underline;
    margin-top: 20px;
  }
</style>
