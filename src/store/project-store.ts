import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Platform } from './wizard-store';

export type ProjectStatus =
  | 'draft'
  | 'script'
  | 'video'
  | 'thumbnail'
  | 'review'
  | 'ready'
  | 'published';

interface Script {
  hook: string;
  intro: string;
  mainPoints: string[];
  callToAction: string;
  outro: string;
  fullText: string;
}

interface PlatformContent {
  platform: Platform;
  title: string;
  description: string;
  hashtags: string[];
  thumbnailUrl?: string;
  videoUrl?: string;
  published: boolean;
  publishedAt?: string;
}

interface Project {
  id: string;
  topic: string;
  status: ProjectStatus;
  script: Script | null;
  platformContent: PlatformContent[];
  createdAt: string;
  updatedAt: string;
}

interface ProjectState {
  // Current project being worked on
  currentProject: Project | null;

  // Project actions
  createProject: (topic: string, platforms: Platform[]) => void;
  updateProject: (data: Partial<Project>) => void;
  setScript: (script: Script) => void;
  updatePlatformContent: (
    platform: Platform,
    data: Partial<PlatformContent>
  ) => void;
  setStatus: (status: ProjectStatus) => void;

  // DIY mode checklist
  diyChecklist: {
    scriptDone: boolean;
    voiceoverDone: boolean;
    videoDone: boolean;
    thumbnailDone: boolean;
  };
  setDiyChecklistItem: (
    item: keyof ProjectState['diyChecklist'],
    done: boolean
  ) => void;

  // Reset
  clearCurrentProject: () => void;
}

const generateProjectId = () => {
  return `proj_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

const initialDiyChecklist = {
  scriptDone: false,
  voiceoverDone: false,
  videoDone: false,
  thumbnailDone: false,
};

export const useProjectStore = create<ProjectState>()(
  persist(
    (set, get) => ({
      currentProject: null,
      diyChecklist: initialDiyChecklist,

      createProject: (topic, platforms) => {
        const now = new Date().toISOString();
        const project: Project = {
          id: generateProjectId(),
          topic,
          status: 'draft',
          script: null,
          platformContent: platforms.map((platform) => ({
            platform,
            title: '',
            description: '',
            hashtags: [],
            published: false,
          })),
          createdAt: now,
          updatedAt: now,
        };
        set({ currentProject: project, diyChecklist: initialDiyChecklist });
      },

      updateProject: (data) =>
        set((state) => ({
          currentProject: state.currentProject
            ? {
                ...state.currentProject,
                ...data,
                updatedAt: new Date().toISOString(),
              }
            : null,
        })),

      setScript: (script) =>
        set((state) => ({
          currentProject: state.currentProject
            ? {
                ...state.currentProject,
                script,
                status: 'script',
                updatedAt: new Date().toISOString(),
              }
            : null,
        })),

      updatePlatformContent: (platform, data) =>
        set((state) => {
          if (!state.currentProject) return state;

          const updatedContent = state.currentProject.platformContent.map(
            (content) =>
              content.platform === platform ? { ...content, ...data } : content
          );

          return {
            currentProject: {
              ...state.currentProject,
              platformContent: updatedContent,
              updatedAt: new Date().toISOString(),
            },
          };
        }),

      setStatus: (status) =>
        set((state) => ({
          currentProject: state.currentProject
            ? {
                ...state.currentProject,
                status,
                updatedAt: new Date().toISOString(),
              }
            : null,
        })),

      setDiyChecklistItem: (item, done) =>
        set((state) => ({
          diyChecklist: {
            ...state.diyChecklist,
            [item]: done,
          },
        })),

      clearCurrentProject: () =>
        set({
          currentProject: null,
          diyChecklist: initialDiyChecklist,
        }),
    }),
    {
      name: 'channelmagic-project',
    }
  )
);
