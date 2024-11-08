export interface LessonContainer {
  title: string;
  lessons: Lesson[];
}
export interface Lesson {
  file: string;
  image: string;
  title: string;
  description?: string;
}

export const lessons: LessonContainer[] = [
  {
    title: "Fast Leds",
    lessons: [
      {
        file: "solid_colors.xml",
        image: "/example-projects/solid_colors.jpeg",
        title: "Solid Colors",
      },
      {
        file: "2different_colors.xml",
        image: "/example-projects/2colors.jpeg",
        title: "Every other color",
      },
      {
        file: "christmas_lights.xml",
        image: "/example-projects/christmas_lights.gif",
        title: "Christmas Lights",
      },
      {
        file: "snake.xml",
        image: "/example-projects/snake.gif",
        title: "Snake Pattern",
      },
      {
        file: "rainbow.xml",
        image: "/example-projects/rainbow.gif",
        title: "Rainbow Lights",
      },
      {
        file: "rainbow_rolling.xml",
        image: "/example-projects/rainbow_streaming.gif",
        title: "Rainbow Lights Streaming",
      },
    ],
  },
  {
    title: "Led Matrix",
    lessons: [
      {
        file: "ledmatrix_happy_face.xml",
        image: "/example-projects/ledmatrix_happy_face.png",
        title: "Happy Face",
      },
      {
        file: "ledmatrix_blink.xml",
        image: "/example-projects/ledmatrix_blink.gif",
        title: "Wink",
      },
      {
        file: "ledmatrix_loop.xml",
        image: "/example-projects/ledmatrix_loop.gif",
        title: "Led Matrix Loop",
      },
    ],
  },
];
