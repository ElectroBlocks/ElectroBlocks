export interface LessonContainer {
  title: string;
  lessons: Lesson[];
}
export interface Lesson {
  file: string;
  image: string;
  title: string;
  description?: string;
  levelImage: string;
}

export const lessons: LessonContainer[] = [
  {
    title: "LEDs",
    lessons: [
      {
        file: "blink.xml",
        image: "/example-projects/resized/blink.gif",
        title: "Blink",
        levelImage: "/example-projects/easy.png",
      },
      {
        file: "traffic_lights.xml",
        image: "/example-projects/resized/traffic_lights.gif",
        title: "Traffic Lights",
        levelImage: "/example-projects/easy.png",
      },
      {
        file: "automatic_parking_gate.xml",
        image: "/example-projects/resized/automatic_parking_gate.gif",
        title: "Automatic Parking Gate",
        levelImage: "/example-projects/medium.png",
      },
      {
        file: "car_parking_system.xml",
        image: "/example-projects/resized/car_parking_system.gif",
        title: "Car Parking System",
        levelImage: "/example-projects/medium.png",
      },
    ],
  },
  {
    title: "RGB LED",
    lessons: [
      {
        file: "rgb_led_pushbutton.xml",
        image: "/example-projects/resized/rgb_led_pushbutton.gif",
        title: "RGB LED with button",
        levelImage: "/example-projects/medium.png",
      },
    ],
  },
  {
    title: "Sensors",
    lessons: [
      {
        file: "intruder_sensor.xml",
        image: "/example-projects/resized/intruder_sensor.gif",
        title: "Intruder Sensor",
        levelImage: "/example-projects/medium.png",
      },
      {
        file: "solar_tracking_system.xml",
        image: "/example-projects/resized/solar_tracking_system.gif",
        title: "Solar Tracking System",
        levelImage: "/example-projects/medium.png",
      },
    ],
  },
  {
    title: "Servos",
    lessons: [
      {
        file: "butterfly.xml",
        image: "/example-projects/butterfly.gif",
        title: "Servo Butterfly",
        levelImage: "/example-projects/medium.png",
      },
    ],
  },
  {
    title: "LCD",
    lessons: [
      {
        file: "lcd_display_text.xml",
        image: "/example-projects/resized/lcd_display_text.gif",
        title: "Display Text",
        levelImage: "/example-projects/easy.png",
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
        levelImage: "/example-projects/easy.png",
      },
      {
        file: "2different_colors.xml",
        image: "/example-projects/2colors.jpeg",
        title: "Every other color",
        levelImage: "/example-projects/medium.png",
      },
      {
        file: "christmas_lights.xml",
        image: "/example-projects/resized/christmas_lights.gif",
        title: "Christmas Lights",
        levelImage: "/example-projects/medium.png",
      },
      {
        file: "snake.xml",
        image: "/example-projects/resized/snake.gif",
        title: "Snake Pattern",
        levelImage: "/example-projects/hard.png",
      },
      {
        file: "rainbow.xml",
        image: "/example-projects/resized/rainbow.gif",
        title: "Rainbow Lights",
        levelImage: "/example-projects/hard.png",
      },
      {
        file: "rainbow_rolling.xml",
        image: "/example-projects/resized/rainbow_streaming.gif",
        title: "Rainbow Lights Streaming",
        levelImage: "/example-projects/hard.png",
      },
      {
        file: "sonar_rgbleds.xml",
        image: "/example-projects/resized/sonar_rgbleds.gif",
        title: "Motion Sensor with RGB Leds",
        levelImage: "/example-projects/medium.png",
      },
      {
        file: "sonar_rgbleds_spin.xml",
        image: "/example-projects/resized/sonar_rgbleds_spin.gif",
        title: "Motion Sensor with Spinning Lights",
        levelImage: "/example-projects/hard.png",
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
        levelImage: "/example-projects/easy.png",
      },
      {
        file: "ledmatrix_blink.xml",
        image: "/example-projects/resized/ledmatrix_blink.gif",
        title: "Wink",
        levelImage: "/example-projects/easy.png",
      },
      {
        file: "ledmatrix_loop.xml",
        image: "/example-projects/resized/ledmatrix_loop.gif",
        title: "Led Matrix Loop",
        levelImage: "/example-projects/medium.png",
      },
      {
        file: "ledmatrix_blink.xml",
        image: "/example-projects/resized/ledmatrix_blink.gif",
        title: "Wink",
        levelImage: "/example-projects/easy.png",
      },
    ],
  },
];
