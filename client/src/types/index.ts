// Shared TypeScript interfaces and types for the application

export interface Project {
  _id: string;
  title: string;
  description: string;
  image?: string;
  githubLink?: string;
  liveLink?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Blog {
  _id: string;
  title: string;
  content: string;
  summary?: string;
  author: {
    _id: string;
    username: string;
    email: string;
  };
  tags?: string[];
  published: boolean;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Skill {
  _id: string;
  name: string;
  x: string;
  y: string;
  order?: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface AboutData {
  _id: string;
  biography?: string;
  profileImage?: string;
  satisfiedClients?: number;
  projectsCompleted?: number;
  yearsOfExperience?: number;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface HomeContent {
  _id: string;
  heroText?: string;
  bioParagraph?: string;
  profileImage?: string;
  resumeLink?: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  _id: string;
  username: string;
  email: string;
  role: "user" | "admin" | "seller";
  createdAt: string;
  updatedAt: string;
}

export interface FormMessage {
  type: "success" | "error";
  text: string;
}
