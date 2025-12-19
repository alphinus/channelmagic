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

  // Database ID (separate from local id)
  videoId: string | null;

  // Project actions
  createProject: (topic: string, platforms: Platform[]) => void;
  updateProject: (data: Partial<Project>) => void;
  setScript: (script: Script) => void;
  updatePlatformContent: (
    platform: Platform,
    data: Partial<PlatformContent>
  ) => void;
  setStatus: (status: ProjectStatus) => void;

  // Database sync
  setVideoId: (id: string | null) => void;
  saveToDatabase: () => Promise<string | null>;
  updateInDatabase: (data: Record<string, unknown>) => Promise<boolean>;

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
      videoId: null,
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
        set({ currentProject: project, videoId: null, diyChecklist: initialDiyChecklist });
      },

      setVideoId: (id) => set({ videoId: id }),

      saveToDatabase: async () => {
        const state = get();
        if (!state.currentProject) return null;

        try {
          const response = await fetch('/api/videos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              title: state.currentProject.topic,
              topic: state.currentProject.topic,
              status: state.currentProject.status,
              platforms: state.currentProject.platformContent.map(p => p.platform),
            }),
          });

          if (!response.ok) {
            console.error('Failed to save video');
            return null;
          }

          const data = await response.json();
          set({ videoId: data.id });
          return data.id;
        } catch (error) {
          console.error('Error saving video:', error);
          return null;
        }
      },

      updateInDatabase: async (data) => {
        const state = get();
        if (!state.videoId) return false;

        try {
          const response = await fetch(`/api/videos/${state.videoId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          });

          return response.ok;
        } catch (error) {
          console.error('Error updating video:', error);
          return false;
        }
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
          videoId: null,
          diyChecklist: initialDiyChecklist,
        }),
    }),
    {
      name: 'channelmagic-project',
    }
  )
);
