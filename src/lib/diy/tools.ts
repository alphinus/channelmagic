export type ToolTier = 'free' | 'freemium' | 'trial';
export type ToolCategory = 'script' | 'video' | 'thumbnail' | 'voiceover' | 'avatar';

export interface Tool {
  name: string;
  url: string;
  tier: ToolTier;
  icon?: string;
  platforms?: ('web' | 'mobile' | 'desktop')[];
  limit?: string;
  features?: string[];
}

export const diyTools: Record<ToolCategory, Tool[]> = {
  script: [
    { name: 'ChatGPT', url: 'https://chat.openai.com', tier: 'free', icon: '🤖' },
    { name: 'Claude', url: 'https://claude.ai', tier: 'free', icon: '🧠' },
    { name: 'Gemini', url: 'https://gemini.google.com', tier: 'free', icon: '✨' },
    { name: 'Perplexity', url: 'https://perplexity.ai', tier: 'free', icon: '🔍' },
  ],
  video: [
    { name: 'CapCut', url: 'https://capcut.com', tier: 'free', icon: '🎬', platforms: ['web', 'mobile', 'desktop'], features: ['Templates', 'Auto-Captions', 'Effects'] },
    { name: 'Canva Video', url: 'https://canva.com/video', tier: 'freemium', icon: '🎨', platforms: ['web', 'mobile'] },
    { name: 'InShot', url: 'https://inshot.com', tier: 'free', icon: '📱', platforms: ['mobile'] },
    { name: 'DaVinci Resolve', url: 'https://blackmagicdesign.com/products/davinciresolve', tier: 'free', icon: '🎥', platforms: ['desktop'] },
  ],
  thumbnail: [
    { name: 'Canva', url: 'https://canva.com', tier: 'freemium', icon: '🎨', features: ['Templates', 'Text Effects'] },
    { name: 'Photopea', url: 'https://photopea.com', tier: 'free', icon: '🖼️', features: ['Photoshop Alternative'] },
    { name: 'Figma', url: 'https://figma.com', tier: 'freemium', icon: '✏️' },
  ],
  voiceover: [
    { name: 'ElevenLabs', url: 'https://elevenlabs.io', tier: 'free', icon: '🎙️', limit: '10,000 chars/month' },
    { name: 'Natural Readers', url: 'https://naturalreaders.com', tier: 'free', icon: '📖' },
    { name: 'Murf AI', url: 'https://murf.ai', tier: 'trial', icon: '🎤', limit: '10 min free' },
  ],
  avatar: [
    { name: 'D-ID', url: 'https://d-id.com', tier: 'trial', icon: '👤', limit: '5 min free' },
    { name: 'Synthesia', url: 'https://synthesia.io', tier: 'trial', icon: '🎭' },
    { name: 'HeyGen', url: 'https://heygen.com', tier: 'trial', icon: '🌟', limit: '1 credit free' },
  ],
};

export function getToolsByCategory(category: ToolCategory): Tool[] {
  return diyTools[category] || [];
}

export function getFreeTools(category: ToolCategory): Tool[] {
  return diyTools[category].filter(t => t.tier === 'free');
}
