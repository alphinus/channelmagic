export type Platform = 'youtube' | 'tiktok' | 'instagram';

export interface PlatformFormat {
  ratio: '16:9' | '9:16' | '1:1';
  maxDuration: number | null;
  titleMax?: number;
  captionMax?: number;
  descriptionMax?: number;
}

export interface PlatformConfig {
  name: string;
  icon: string;
  color: string;
  formats: Record<string, PlatformFormat>;
  features: string[];
  hashtagCount?: number;
}

export const platforms: Record<Platform, PlatformConfig> = {
  youtube: {
    name: 'YouTube',
    icon: '▶️',
    color: '#FF0000',
    formats: {
      long: { ratio: '16:9', maxDuration: null, titleMax: 100, descriptionMax: 5000 },
      shorts: { ratio: '9:16', maxDuration: 60, titleMax: 100 },
    },
    features: ['chapters', 'cards', 'endscreen', 'playlists'],
  },
  tiktok: {
    name: 'TikTok',
    icon: '🎵',
    color: '#000000',
    formats: {
      video: { ratio: '9:16', maxDuration: 180, captionMax: 2200 },
    },
    features: ['hashtags', 'sounds', 'duet', 'stitch'],
    hashtagCount: 5,
  },
  instagram: {
    name: 'Instagram Reels',
    icon: '📸',
    color: '#E4405F',
    formats: {
      reels: { ratio: '9:16', maxDuration: 90, captionMax: 2200 },
    },
    features: ['hashtags', 'audio', 'collab', 'remix'],
    hashtagCount: 30,
  },
};

export function getPlatformConfig(platform: Platform): PlatformConfig {
  return platforms[platform];
}

export function getRecommendedFormat(platform: Platform, duration: number): string {
  const config = platforms[platform];
  if (platform === 'youtube') {
    return duration <= 60 ? 'shorts' : 'long';
  }
  return Object.keys(config.formats)[0];
}
