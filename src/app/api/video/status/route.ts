import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/db/server-client';
import { getVideoStatus } from '@/lib/services/heygen';

export async function GET(request: NextRequest) {
  try {
    // Auth check
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const apiKey = searchParams.get('apiKey');
    const videoId = searchParams.get('videoId');

    if (!apiKey) {
      return NextResponse.json(
        { error: 'HeyGen API key required' },
        { status: 400 }
      );
    }

    if (!videoId) {
      return NextResponse.json(
        { error: 'Video ID required' },
        { status: 400 }
      );
    }

    const status = await getVideoStatus(apiKey, videoId);

    return NextResponse.json({
      success: true,
      status,
    });
  } catch (error) {
    console.error('Video status error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to get video status',
      },
      { status: 500 }
    );
  }
}
