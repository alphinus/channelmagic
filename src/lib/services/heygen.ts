export interface HeyGenVideoParams {
  script: string;
  avatarId?: string;
  voiceId?: string;
  backgroundColor?: string;
}

export interface HeyGenVideoResponse {
  data: {
    video_id: string;
  };
}

export interface HeyGenVideoStatus {
  data: {
    status: 'pending' | 'processing' | 'completed' | 'failed';
    video_url?: string;
    error?: string;
  };
}

export interface HeyGenQuotaResponse {
  data: {
    remaining_quota: number;
  };
}

export async function createVideo(
  apiKey: string,
  params: HeyGenVideoParams
): Promise<string> {
  const response = await fetch('https://api.heygen.com/v2/video/generate', {
    method: 'POST',
    headers: {
      'X-Api-Key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      video_inputs: [
        {
          character: {
            type: 'avatar',
            avatar_id: params.avatarId || 'default',
          },
          voice: {
            type: 'text',
            input_text: params.script,
            voice_id: params.voiceId || 'default',
          },
        },
      ],
      dimension: {
        width: 1920,
        height: 1080,
      },
      background_color: params.backgroundColor || '#000000',
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Video creation failed: ${error}`);
  }

  const data: HeyGenVideoResponse = await response.json();
  return data.data.video_id;
}

export async function getVideoStatus(
  apiKey: string,
  videoId: string
): Promise<HeyGenVideoStatus['data']> {
  const response = await fetch(`https://api.heygen.com/v1/video_status.get?video_id=${videoId}`, {
    headers: {
      'X-Api-Key': apiKey,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to get video status: ${error}`);
  }

  const data: HeyGenVideoStatus = await response.json();
  return data.data;
}

export async function getRemainingQuota(apiKey: string): Promise<number> {
  const response = await fetch('https://api.heygen.com/v2/user/remaining_quota', {
    headers: {
      'X-Api-Key': apiKey,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to get quota: ${error}`);
  }

  const data: HeyGenQuotaResponse = await response.json();
  return data.data.remaining_quota;
}

export async function validateHeyGenKey(apiKey: string): Promise<boolean> {
  try {
    await getRemainingQuota(apiKey);
    return true;
  } catch {
    return false;
  }
}
