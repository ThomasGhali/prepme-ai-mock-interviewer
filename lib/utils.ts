import { clsx, type ClassValue } from 'clsx';
import { interviewCovers } from "@/constants";
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const techIconBaseURL = 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons';

const mappings = {
  react: 'react',
  next: 'nextjs',
  typescript: 'typescript',
  javascript: 'javascript',
  java: 'java',
  python: 'python',
  csharp: 'csharp',
  cpp: 'cplusplus',
  flutter: 'flutter',
  dart: 'dart',
  kotlin: 'kotlin',
  swift: 'swift',
  go: 'go',
  rust: 'rust',
  ruby: 'ruby',
  php: 'php',
  html: 'html5',
  css: 'css3',
  tailwindcss: 'tailwindcss',
  mysql: 'mysql',
  postgres: 'postgresql',
  mongodb: 'mongodb',
  redis: 'redis',
  docker: 'docker',
  kubernetes: 'kubernetes',
  aws: 'amazonwebservices',
  azure: 'azure',
  gcp: 'googlecloud',
  git: 'git',
  github: 'github',
  gitlab: 'gitlab',
  linux: 'linux',
  ubuntu: 'ubuntu',
  node: 'nodejs',
  express: 'express',
  nestjs: 'nestjs',
  spring: 'spring',
  django: 'django',
  flask: 'flask',
  fastapi: 'fastapi',
  vue: 'vuejs',
  angular: 'angularjs',
  svelte: 'svelte',
};

const normalizeTechName = (tech: string) => {
  const key = tech.toLowerCase().replace(/\.js$/, '').replace(/\s+/g, '');
  return mappings[key as keyof typeof mappings];
};

const checkIconExists = async (url: string) => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok; // Returns true if the icon exists
  } catch {
    return false;
  }
};

export const getTechLogos = async (techArray: string[]) => {
  const logoURLs = techArray.map((tech) => {
    const normalized = normalizeTechName(tech);
    return {
      tech,
      url: `${techIconBaseURL}/${normalized}/${normalized}-original.svg`,
    };
  });

  const results = await Promise.all(
    logoURLs.map(async ({ tech, url }) => ({
      tech,
      url: (await checkIconExists(url)) ? url : '/tech.svg',
    })),
  );

  return results;
};

export const getRandomInterviewCover = () => {
  const randomIndex = Math.floor(Math.random() * interviewCovers.length);
  return `/covers${interviewCovers[randomIndex]}`;
};
