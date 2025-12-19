import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Platform = 'youtube' | 'tiktok' | 'instagram';
export type ContentStyle = 'educational' | 'entertaining' | 'inspirational';
export type Frequency = 'daily' | '2-3x-week' | 'weekly';
export type Niche =
  | 'fitness'
  | 'finance'
  | 'gaming'
  | 'cooking'
  | 'tech'
  | 'lifestyle'
  | 'education'
  | 'music'
  | 'business'
  | 'travel'
  | 'other';

interface ChannelData {
  name: string;
  niche: Niche | null;
  targetAudience: string;
  customNiche?: string; // When niche is 'other'
}

interface ContentStrategy {
  topics: string[];
  style: ContentStyle | null;
  frequency: Frequency | null;
}

interface WizardState {
  // Current step
  currentStep: number;
  setCurrentStep: (step: number) => void;

  // Step 1: Channel Setup
  channel: ChannelData;
  setChannel: (data: Partial<ChannelData>) => void;

  // Step 2: Content Strategy
  strategy: ContentStrategy;
  setStrategy: (data: Partial<ContentStrategy>) => void;

  // Step 3: Platforms
  platforms: Platform[];
  setPlatforms: (platforms: Platform[]) => void;
  togglePlatform: (platform: Platform) => void;

  // Completion
  isComplete: boolean;
  setComplete: (complete: boolean) => void;

  // Database sync
  channelId: string | null;
  setChannelId: (id: string | null) => void;
  saveChannelToDatabase: () => Promise<string | null>;

  // Navigation helpers
  canProceed: (step: number) => boolean;
  getProgress: () => number;

  // Reset
  reset: () => void;
}

const initialState = {
  currentStep: 1,
  channel: {
    name: '',
    niche: null as Niche | null,
    targetAudience: '',
  },
  strategy: {
    topics: [],
    style: null as ContentStyle | null,
    frequency: null as Frequency | null,
  },
  platforms: [] as Platform[],
  isComplete: false,
  channelId: null as string | null,
};

export const useWizardStore = create<WizardState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setCurrentStep: (step) => set({ currentStep: step }),

      setChannel: (data) =>
        set((state) => ({
          channel: { ...state.channel, ...data },
        })),

      setStrategy: (data) =>
        set((state) => ({
          strategy: { ...state.strategy, ...data },
        })),

      setPlatforms: (platforms) => set({ platforms }),

      togglePlatform: (platform) =>
        set((state) => {
          const exists = state.platforms.includes(platform);
          return {
            platforms: exists
              ? state.platforms.filter((p) => p !== platform)
              : [...state.platforms, platform],
          };
        }),

      setComplete: (complete) => set({ isComplete: complete }),

      setChannelId: (id) => set({ channelId: id }),

      saveChannelToDatabase: async () => {
        const state = get();
        try {
          const response = await fetch('/api/channels', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: state.channel.name,
              description: state.channel.targetAudience || null,
            }),
          });

          if (!response.ok) {
            console.error('Failed to save channel');
            return null;
          }

          const data = await response.json();
          set({ channelId: data.id });
          return data.id;
        } catch (error) {
          console.error('Error saving channel:', error);
          return null;
        }
      },

      canProceed: (step) => {
        const state = get();
        switch (step) {
          case 1:
            return (
              state.channel.name.trim().length >= 2 &&
              state.channel.niche !== null
            );
          case 2:
            return (
              state.strategy.topics.length > 0 &&
              state.strategy.style !== null &&
              state.strategy.frequency !== null
            );
          case 3:
            return state.platforms.length > 0;
          case 4:
            return true; // Mode selection - always can proceed after choosing
          case 5:
            return true; // Setup step - validation depends on mode
          case 6:
            return true; // Ready step
          default:
            return false;
        }
      },

      getProgress: () => {
        const state = get();
        return Math.round((state.currentStep / 6) * 100);
      },

      reset: () => set(initialState),
    }),
    {
      name: 'channelmagic-wizard',
    }
  )
);
