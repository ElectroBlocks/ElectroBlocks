export interface LessonContainer {
  title: string;
  lessons: Lesson[];
}
export interface Lesson {
  file: string;
  image: string;
  title: string;
  description: string;
}

export const lessons: LessonContainer[] = [
  {
    title: "Fast Leds",
    lessons: [
      {
        file: "snake.xml",
        image: "/example-projects/snake.gif",
        title: "Snake Pattern",
        description: "A snake LED Light Pattern.",
      },
      {
        file: "rainbow.xml",
        image: "/example-projects/rainbow.gif",
        title: "Rainbow Lights",
        description: "Create your own rainbow light pattern.",
      },
    ],
  },
];
