import { NextRequest, NextResponse } from 'next/server';
import { createVideo, type HeyGenVideoParams } from '@/lib/services/heygen';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { apiKey, ...params } = body;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'HeyGen API key required' },
        { status: 400 }
      );
    }

    if (!params.script) {
      return NextResponse.json(
        { error: 'Script is required' },
        { status: 400 }
      );
    }

    const videoId = await createVideo(apiKey, params as HeyGenVideoParams);

    return NextResponse.json({
      success: true,
      videoId,
    });
  } catch (error) {
    console.error('Video generation error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Video generation failed',
      },
      { status: 500 }
    );
  }
}
