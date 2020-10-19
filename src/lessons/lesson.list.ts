import type { Lesson, Lessons } from "./lesson.model";
import axios from 'axios';
import electroblockServoLesson from "./electroblocks/servo.json";

const lessons: Array<Lesson> = [];

export const getLessons = async (bucketName: string): Promise<Lessons> => {
  const response =
    await axios.get<Lessons>(`https://storage.googleapis.com/${bucketName}/lesson-list.json`);

  return response.data;
};

export const getLesson = async (bucketName: string, id: string) => {
  const lesson =  await axios.get<Lesson>(`https://storage.googleapis.com/${bucketName}/lessons/${id}.json`);

  return lesson.data;
};

const addLesson = (lesson: Lesson) => {
  lessons.push(lesson);
};

