export interface LessonForm<T> {
  title: string;
  description: string;
  mainPicture: T;
  url: string;
  type: LessonTypes;
}

export interface Lesson<T> {
  id?: string;
  title: string;
  description: string;
  steps?: Step[];
  mainPicture: string;
  url?: string;
  published: boolean;
  userId: string;
  type: LessonTypes;
  created: T;
  updated: T;
  author?: Author;
}

export interface Author {
  name: string;
  email: string;
  bio: string;
  link: string;
}

export enum ContentTypes {
  YOUTUBE = "YOUTUBE",
  YOUTUBE_PLAYLIST = "YOUTUBE_PLAYLIST",
  PICTURE = "PICTURE",
  PDF = "PDF",
  AUDIO = "AUDIO",
  CODE = "CODE",
  MARKDOWN = "MARKDOWN",
  VIDEO = "VIDEO",
}

export enum LessonTypes {
  YOUTUBE_ONLY = "YOUTUBE_ONLY",
  TUTORIALS = "TUTORIALS",
}

export interface Step {
  contentType: ContentTypes;
  url?: string;
  youtubeId?: string;
  code?: string;
  language?: string;
  canCopy?: boolean;
  description: string;
  step?: string;
  id?: string;
  stepNumber: number;
}

export enum Languages {
  css = "css",
  js = "js",
  html = "html",
  python = "python",
  go = "go",
  java = "java",
  kotlin = "kotlin",
  sql = "sql",
  rust = "rust",
  csharp = "csharp",
  typescript = "typescript",
  c = "c",
  dart = "dart",
  ruby = "ruby",
  lua = "lua",
  swift = "swift",
  r = "r",
  cpp = "cpp",
}

export interface Page {
  lessonIds: string[];
}

export interface Organization {
  name: string;
  website: string;
  pages: { [key: string]: Page };
  userIds: string[];
  ownerUserId: string;
}
