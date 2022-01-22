export interface VideoLesson {
  id: string;
  title: string;
  lessonUrl: string;
  videoUrl: string;
}

export interface StarterLesson {
  id: string;
  title: string;
  projectUrl: string;
  pictureUrl: string;
  lessonUrl: string;
}

export const videoLessons: Array<VideoLesson> = [
  {
    id: 'introduction',
    title: 'Introduction',
    videoUrl:
      'https://storage.googleapis.com/electroblocks/videos/1-introduction.mp4',
    lessonUrl: 'https://electroblocks.github.io/docs/',
  },
  {
    id: 'what-is-arduino',
    title: "What's an Arduino?",
    videoUrl:
      'https://storage.googleapis.com/electroblocks/videos/2-arduino.mp4',
    lessonUrl:
      'https://electroblocks.github.io/docs/lessons/what-is-an-arduino/',
  },
  {
    id: 'blink',
    title: 'LED Blink',
    videoUrl: 'https://storage.googleapis.com/electroblocks/videos/3-blink.mp4',
    lessonUrl: 'https://electroblocks.github.io/docs/lessons/blink/',
  },
  {
    id: 'sending-messages',
    title: 'Sending Messages',
    videoUrl:
      'https://storage.googleapis.com/electroblocks/videos/4-sending-messages.mp4',
    lessonUrl: 'https://electroblocks.github.io/docs/lessons/sending-messages/',
  },
  {
    id: 'high-five',
    title: 'Servo - High Five',
    videoUrl:
      'https://storage.googleapis.com/electroblocks/videos/5-high-five.mp4',
    lessonUrl: 'https://electroblocks.github.io/docs/lessons/highfive/',
  },
  {
    id: 'wave',
    title: 'Servo - Wave',
    videoUrl: 'https://storage.googleapis.com/electroblocks/videos/6-wave.mp4',
    lessonUrl: 'https://electroblocks.github.io/docs/lessons/wave/',
  },
  {
    id: 'rgbled',
    title: 'RGB LED',
    videoUrl:
      'https://storage.googleapis.com/electroblocks/videos/7-rbgled.mp4',
    lessonUrl: 'https://electroblocks.github.io/docs/lessons/rgbled/',
  },
  {
    id: 'intro-FastLED',
    title: 'Intro - FastLED',
    videoUrl:
      'https://storage.googleapis.com/electroblocks/videos/8-intro-rgb-light-strip.mp4',
    lessonUrl: 'https://electroblocks.github.io/docs/lessons/fastled/',
  },
  {
    id: 'fastLED-alternating-pattern',
    title: 'FastLED - Alternating Colors',
    videoUrl:
      'https://storage.googleapis.com/electroblocks/videos/9-FastLED-Alternating-Pattern.mp4',
    lessonUrl: 'https://electroblocks.github.io/docs/lessons/fastled/',
  },
  {
    id: 'fastLED-snake-pattern',
    title: 'FastLED - Snake',
    videoUrl:
      'https://storage.googleapis.com/electroblocks/videos/9-FastLED-Alternating-Pattern.mp4',
    lessonUrl: 'https://electroblocks.github.io/docs/lessons/fastled/',
  },
];
export const starterLessons: Array<StarterLesson> = [
  {
    id: 'blink',
    title: 'Blink',
    pictureUrl:
      'https://storage.googleapis.com/electroblocks/starters/blink/picture.png',
    projectUrl:
      'https://storage.googleapis.com/electroblocks/starters/blink/project.xml',
    lessonUrl: 'https://electroblocks.github.io/docs/lessons/blink/',
  },
  {
    id: 'double-blink',
    title: 'Double Blink',
    pictureUrl:
      'https://storage.googleapis.com/electroblocks/starters/double-blink/picture.png',
    projectUrl:
      'https://storage.googleapis.com/electroblocks/starters/double-blink/project.xml',
    lessonUrl: 'https://electroblocks.github.io/docs/lessons/blink/',
  },
  {
    id: 'alernating-blink',
    title: 'Alternating Blink',
    pictureUrl:
      'https://storage.googleapis.com/electroblocks/starters/alternating-blink/picture.png',
    projectUrl:
      'https://storage.googleapis.com/electroblocks/starters/alternating-blink/project.xml',
    lessonUrl: 'https://electroblocks.github.io/docs/lessons/blink/',
  },
  {
    id: 'high-five',
    title: 'High Five',
    pictureUrl:
      'https://storage.googleapis.com/electroblocks/starters/highfive/picture.png',
    projectUrl:
      'https://storage.googleapis.com/electroblocks/starters/highfive/project.xml',
    lessonUrl: 'https://electroblocks.github.io/docs/lessons/highfive/',
  },
];
