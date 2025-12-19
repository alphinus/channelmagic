import type { Platform } from '@/store/wizard-store';
import { generateScriptPrompt } from '@/lib/templates/script-prompts';

export interface ScriptGenerationParams {
  topic: string;
  style: 'educational' | 'entertaining' | 'inspirational';
  duration: 'short' | 'long';
  platform: Platform;
  locale: 'de' | 'en';
  niche?: string;
  targetAudience?: string;
}

export interface OpenRouterResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export async function generateScript(
  apiKey: string,
  params: ScriptGenerationParams
): Promise<string> {
  const prompt = generateScriptPrompt(params);

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://channelmagic.vercel.app',
      'X-Title': 'ChannelMagic',
    },
    body: JSON.stringify({
      model: 'anthropic/claude-3-haiku',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 2000,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Script generation failed: ${error}`);
  }

  const data: OpenRouterResponse = await response.json();
  return data.choices[0]?.message?.content || '';
}

export async function validateOpenRouterKey(apiKey: string): Promise<boolean> {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/models', {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    });
    return response.ok;
  } catch {
    return false;
  }
}
