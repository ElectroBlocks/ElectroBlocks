export interface Lesson {
  title: string;
  steps: Step[];
  id: string;
  contentType: "jpg" | "gif" | "png";
  folderName: string;
  authorFolderName: string;
  author: string;
  email: string;
  version: number;
}

export interface Step {
  title: string;
  contentType: "youtube" | "jpg" | "gif" | "png";
  youtubeId?: string;
  id: string;
}
