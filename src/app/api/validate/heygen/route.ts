import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/db/server-client';

export async function POST(request: NextRequest) {
  try {
    // Auth check
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { apiKey } = await request.json();

    if (!apiKey) {
      return NextResponse.json({ valid: false, error: 'API key required' }, { status: 400 });
    }

    // Test the key with HeyGen API
    const response = await fetch('https://api.heygen.com/v2/user/remaining_quota', {
      headers: {
        'X-Api-Key': apiKey,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return NextResponse.json({
        valid: true,
        quota: data.data?.remaining_quota || 0
      });
    }

    return NextResponse.json({ valid: false, error: 'Invalid API key' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ valid: false, error: 'Validation failed' }, { status: 500 });
  }
}
