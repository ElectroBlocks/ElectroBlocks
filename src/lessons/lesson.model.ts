export interface Lesson {
  title: string;
  steps: Step[];
  id: string;
  mainPicture: string;
  level: "Beginner" | "Intermediate" | "Expert" | "All Levels";
  author: string;
  authorUrl: string;
  category: string; // This will be used later on
  email: string;
  version: number;
}

export interface Step {
  contentType: "video" | "picture";
  url: string;
  step: string;
  id: string;
}


export interface LessonCompat {
  title: string;
  id: string;
  mainPicture: string;
  lessonUrl: string;
}

export interface Lessons {
  date: string;
  lessons: LessonCompat[];
}