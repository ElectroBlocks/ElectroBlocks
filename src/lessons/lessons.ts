export interface LessonContainer {
  title: string;
  lessons: Lesson[];
}
export interface Lesson {
  file: string;
  image: string;
  title: string;
  description?: string;
  difficulty: number;
}

export const lessons: LessonContainer[] = [
  {
    title: "LEDs",
    lessons: [
      {
        file: "blink.xml",
        image: "/example-projects/blink.gif",
        title: "Blink",
        difficulty: 1,
      },
      {
        file: "traffic_lights.xml",
        image: "/example-projects/traffic_lights.gif",
        title: "Traffic Lights",
        difficulty: 1,
      },
    ],
  },
  {
    title: "RGB LED",
    lessons: [
      {
        file: "rgb_led_pushbutton.xml",
        image: "/example-projects/rgb_led_pushbutton.gif",
        title: "RGB LED with buttons",
        difficulty: 2,
      },
    ],
  },
  {
    title: "Sensors",
    lessons: [
      {
        file: "intruder_sensor.xml",
        image: "/example-projects/intruder_sensor.gif",
        title: "Intruder Sensor",
        difficulty: 2,
      },
    ],
  },
  {
    title: "LCD",
    lessons: [
      {
        file: "lcd_display_text.xml",
        image: "/example-projects/lcd_display_text.gif",
        title: "Display Text",
        difficulty: 1,
      },
    ],
  },
  {
    title: "Fast Leds",
    lessons: [
      {
        file: "solid_colors.xml",
        image: "/example-projects/solid_colors.jpeg",
        title: "Solid Colors",
        difficulty: 1,
      },
      {
        file: "2different_colors.xml",
        image: "/example-projects/2colors.jpeg",
        title: "Every other color",
        difficulty: 2,
      },
      {
        file: "christmas_lights.xml",
        image: "/example-projects/christmas_lights.gif",
        title: "Christmas Lights",
        difficulty: 2,
      },
      {
        file: "snake.xml",
        image: "/example-projects/snake.gif",
        title: "Snake Pattern",
        difficulty: 3,
      },
      {
        file: "rainbow.xml",
        image: "/example-projects/rainbow.gif",
        title: "Rainbow Lights",
        difficulty: 3,
      },
      {
        file: "rainbow_rolling.xml",
        image: "/example-projects/rainbow_streaming.gif",
        title: "Rainbow Lights Streaming",
        difficulty: 3,
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
        difficulty: 1,
      },
      {
        file: "ledmatrix_blink.xml",
        image: "/example-projects/ledmatrix_blink.gif",
        title: "Wink",
        difficulty: 1,
      },
      {
        file: "ledmatrix_loop.xml",
        image: "/example-projects/ledmatrix_loop.gif",
        title: "Led Matrix Loop",
        difficulty: 2,
      },
    ],
  },
];
