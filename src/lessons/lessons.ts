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
        image: "/example-projects/solid_colors.png",
        title: "Solid Colors",
      },
      {
        file: "2different_colors.xml",
        image: "/example-projects/2colors.png",
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
        file: "rainbow.xml",
        image: "/example-projects/rainbow_streaming.gif",
        title: "Rainbow Lights Streaming",
      },
    ],
  },
];
