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
];

export const starterLessons: Array<StarterLesson> = [];
