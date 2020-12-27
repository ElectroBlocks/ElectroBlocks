export interface Author {
  name: string;
  email: string;
  bio: string;
  link: string;
}

export interface LessonForm<T> {
  title: string;
  description: string;
  mainPicture: T;
  level: LessonLevel;
  category: string;
  type: LessonType;
}

export interface UplaodFileStep {
  file: File;
  step: string;
}
export interface UploadStep {
  contentType: "youtube" | "picture";
  youtubeId?: string;
  file?: File;
  body: string;
}

export enum LessonType {
  SCRATCH = "Scratch",
  ROBLOX = "Roblox",
  JAVASCRIPT = "Javascript",
  PYGAME = "PyGame",
  PHASERJS = "Phaser.js",
  APP_INVENTOR = "App Inventor",
  P5JS = "P5.js",
  ELECTROBLOCK = "Electroblocks",
}

export enum Categories {
  BIG_PROJECTS = "Big Projects",
  PROJECTS = "Projects",
  HOW_TOS = "How to use platform",
  QUICK_TIPS = "Quick Tips",
  TEACHERS = "Teachers",
}

export interface Lesson<T> {
  id?: string;
  title: string;
  description: string;
  steps?: Step[];
  mainPicture: string;
  level: LessonLevel;
  type: LessonType;
  category: string; // This will be used later on
  approved: boolean;
  published: boolean;
  userId: string;
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

export interface LessonForm<T> {
  title: string;
  description: string;
  mainPicture: T;
  level: LessonLevel;
  category: string;
  type: LessonType;
}

export interface Step {
  contentType: "youtube" | "picture" | "code";
  url?: string;
  youtubeId?: string;
  code?: string;
  language?: string;
  canCopy?: boolean;
  description: string;
  step: string;
  id?: string;
  stepNumber: number;
}

export interface UplaodFileStep {
  file: File;
  step: string;
}
export interface UploadStep {
  contentType: "youtube" | "picture";
  youtubeId?: string;
  file?: File;
  body: string;
}

export enum LessonLevel {
  BEGINNER = "Beginner",
  INTERMEDIATE = "Intermediate",
  ADVANCED = "Advanced",
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
