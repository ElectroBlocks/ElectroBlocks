import type { Lesson } from "./lesson.model";

import electroblockServoLesson from "./electroblocks/servo.json";

const lessons: Array<Lesson> = [];

export const getLessons = (): Array<Lesson> => {
  // TODO ORDER LESSONS
  return lessons;
};

export const getLesson = (id: string) => {
  const lesson = lessons.find((l) => l.id === id);
  if (lesson) {
    return lesson;
  }

  throw new Error(`No lesson id found for ${id}.`);
};

const addLesson = (lesson: Lesson) => {
  lessons.push(lesson);
};

// added Servo Lesson
addLesson(electroblockServoLesson as Lesson);
addLesson(electroblockServoLesson as Lesson);
addLesson(electroblockServoLesson as Lesson);
addLesson(electroblockServoLesson as Lesson);
addLesson(electroblockServoLesson as Lesson);
addLesson(electroblockServoLesson as Lesson);
addLesson(electroblockServoLesson as Lesson);
