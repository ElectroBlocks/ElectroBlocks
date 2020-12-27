import firebase from "firebase/app";
import { LessonType, Lesson } from "./lesson.model";

export const getLessons = async () => {
  const db = firebase.firestore();
  const lessonsRef = await db
    .collection("lessons")
    .where("type", "==", LessonType.ELECTROBLOCK)
    .where("published", "==", true)
    .get();

  if (lessonsRef.empty) {
    return [];
  }

  return lessonsRef.docs.map((d) => {
    return {
      ...d.data(),
      id: d.id,
    } as Lesson<any>;
  });
};

export const getLesson = async (id: string) => {
  const db = firebase.firestore();
  const lessonsRef = await db.collection("lessons").doc(id).get();

  const lesson = { ...lessonsRef.data(), id: id, steps: [] };

  const stepsRef = await db
    .collection("lessons")
    .doc(id)
    .collection("steps")
    .orderBy("stepNumber", "asc")
    .get();

  lesson.steps = stepsRef.docs.map((d) => d.data());

  return lesson;
};
