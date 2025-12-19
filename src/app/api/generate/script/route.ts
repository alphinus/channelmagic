import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/db/server-client';
import { generateScript, type ScriptGenerationParams } from '@/lib/services/openrouter';

export async function POST(request: NextRequest) {
  try {
    // Auth check
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { apiKey, ...params } = body;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenRouter API key required' },
        { status: 400 }
      );
    }

    // Validate required parameters
    const requiredFields: (keyof ScriptGenerationParams)[] = [
      'topic',
      'style',
      'duration',
      'platform',
      'locale',
    ];

    for (const field of requiredFields) {
      if (!params[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Validate enum values
    const validStyles = ['educational', 'entertaining', 'inspirational'];
    const validDurations = ['short', 'long'];
    const validPlatforms = ['youtube', 'tiktok', 'instagram'];
    const validLocales = ['de', 'en'];

    if (!validStyles.includes(params.style)) {
      return NextResponse.json(
        { error: `Invalid style. Must be one of: ${validStyles.join(', ')}` },
        { status: 400 }
      );
    }

    if (!validDurations.includes(params.duration)) {
      return NextResponse.json(
        { error: `Invalid duration. Must be one of: ${validDurations.join(', ')}` },
        { status: 400 }
      );
    }

    if (!validPlatforms.includes(params.platform)) {
      return NextResponse.json(
        { error: `Invalid platform. Must be one of: ${validPlatforms.join(', ')}` },
        { status: 400 }
      );
    }

    if (!validLocales.includes(params.locale)) {
      return NextResponse.json(
        { error: `Invalid locale. Must be one of: ${validLocales.join(', ')}` },
        { status: 400 }
      );
    }

    const script = await generateScript(apiKey, params as ScriptGenerationParams);

    return NextResponse.json({
      success: true,
      script,
    });
  } catch (error) {
    console.error('Script generation error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Script generation failed',
      },
      { status: 500 }
    );
  }
}
