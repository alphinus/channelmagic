// API Validation Response Types
export interface ValidationResponse {
  valid: boolean;
  error?: string;
  models?: number;
  quota?: number;
}

// Script Generation Types
export interface ScriptGenerationRequest {
  apiKey: string;
  topic: string;
  style: 'educational' | 'entertaining' | 'inspirational';
  duration: 'short' | 'long';
  platform: 'youtube' | 'tiktok' | 'instagram';
  locale: 'de' | 'en';
  niche?: string;
  targetAudience?: string;
}

export interface ScriptGenerationResponse {
  success: boolean;
  script?: string;
  error?: string;
}

// Video Generation Types
export interface VideoGenerationRequest {
  apiKey: string;
  script: string;
  avatarId?: string;
  voiceId?: string;
  backgroundColor?: string;
}

export interface VideoGenerationResponse {
  success: boolean;
  videoId?: string;
  error?: string;
}

// Video Status Types
export interface VideoStatusResponse {
  success: boolean;
  status?: {
    status: 'pending' | 'processing' | 'completed' | 'failed';
    video_url?: string;
    error?: string;
  };
  error?: string;
}
