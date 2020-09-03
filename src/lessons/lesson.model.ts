export interface Lesson {
  title: string;
  steps: Step[];
  id: string;
  contentType: "jpg" | "gif" | "png";
  folderName: string;
  authorFolderName: string;
  level: "Beginner" | "Intermediate" | "Expert" | "All Levels";
  author: string;
  company: string;
  category: string; // This will be used later on
  email: string;
  version: number;
}

export interface Step {
  title: string;
  contentType: "youtube" | "jpg" | "gif" | "png";
  youtubeId?: string;
  id: string;
}
