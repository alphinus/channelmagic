import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/db/server-client';

// Platform-specific hashtag limits
const PLATFORM_LIMITS: Record<string, number> = {
  youtube: 15,
  tiktok: 30,
  instagram: 30,
};

// Common hashtags by platform and topic keywords
const HASHTAG_POOLS: Record<string, Record<string, string[]>> = {
  youtube: {
    general: ['YouTubeShorts', 'Shorts', 'Viral', 'Trending', 'MustWatch', 'Subscribe'],
    tech: ['Tech', 'Technology', 'TechTips', 'Gadgets', 'Innovation', 'Digital'],
    gaming: ['Gaming', 'Gamer', 'GamePlay', 'VideoGames', 'GamingCommunity'],
    education: ['Education', 'Learning', 'Tutorial', 'HowTo', 'Tips', 'Explained'],
    entertainment: ['Entertainment', 'Fun', 'Comedy', 'Funny', 'Lifestyle'],
    business: ['Business', 'Entrepreneur', 'Marketing', 'Success', 'Money'],
    fitness: ['Fitness', 'Workout', 'Health', 'Gym', 'FitLife', 'Exercise'],
    food: ['Food', 'Cooking', 'Recipe', 'Foodie', 'Delicious', 'Kitchen'],
    travel: ['Travel', 'Adventure', 'Explore', 'Wanderlust', 'TravelVlog'],
    music: ['Music', 'Song', 'MusicVideo', 'Artist', 'NewMusic'],
  },
  tiktok: {
    general: ['FYP', 'ForYou', 'ForYouPage', 'Viral', 'Trending', 'TikTokViral'],
    tech: ['TechTok', 'TechTips', 'LearnOnTikTok', 'Technology', 'Gadgets'],
    gaming: ['GamerTok', 'Gaming', 'GameTok', 'Gamer', 'VideoGames'],
    education: ['LearnOnTikTok', 'EduTok', 'DidYouKnow', 'Facts', 'Tutorial'],
    entertainment: ['Comedy', 'Funny', 'Entertainment', 'Humor', 'LOL'],
    business: ['BusinessTok', 'MoneyTok', 'Entrepreneur', 'SideHustle'],
    fitness: ['FitTok', 'Workout', 'GymTok', 'Fitness', 'HealthTok'],
    food: ['FoodTok', 'Recipe', 'Cooking', 'FoodTikTok', 'Yummy'],
    travel: ['TravelTok', 'TravelTikTok', 'Adventure', 'Explore'],
    music: ['MusicTok', 'NewMusic', 'Song', 'Artist', 'MusicVideo'],
  },
  instagram: {
    general: ['Reels', 'InstaReels', 'Viral', 'Trending', 'Explore', 'Instagram'],
    tech: ['TechReels', 'Technology', 'TechTips', 'Gadgets', 'Digital'],
    gaming: ['GamingReels', 'Gamer', 'Gaming', 'VideoGames', 'GamePlay'],
    education: ['Educational', 'Learning', 'Tips', 'Tutorial', 'HowTo'],
    entertainment: ['Entertainment', 'Funny', 'Comedy', 'Fun', 'Lifestyle'],
    business: ['BusinessReels', 'Entrepreneur', 'Marketing', 'Business'],
    fitness: ['FitnessReels', 'Workout', 'Gym', 'Fitness', 'Health'],
    food: ['FoodReels', 'Foodie', 'Recipe', 'Cooking', 'InstaFood'],
    travel: ['TravelReels', 'Travel', 'Wanderlust', 'Adventure', 'Explore'],
    music: ['MusicReels', 'Music', 'NewMusic', 'Song', 'Artist'],
  },
};

// German hashtags
const GERMAN_HASHTAGS: Record<string, string[]> = {
  general: ['Deutschland', 'German', 'Deutsch'],
  tech: ['TechnikDeutsch', 'Digitalisierung'],
  education: ['Wissen', 'Lernen', 'Bildung'],
  entertainment: ['Unterhaltung', 'Lustig', 'Spaß'],
  business: ['Unternehmer', 'Erfolg', 'Selbstständig'],
  fitness: ['FitDeutschland', 'Training', 'Gesundheit'],
  food: ['Kochen', 'Rezept', 'Lecker'],
  travel: ['Reisen', 'Urlaub', 'Abenteuer'],
};

function detectCategory(topic: string, script?: string): string {
  const text = `${topic} ${script || ''}`.toLowerCase();

  const categoryKeywords: Record<string, string[]> = {
    tech: ['tech', 'software', 'app', 'computer', 'phone', 'digital', 'ai', 'ki', 'programm', 'code'],
    gaming: ['game', 'gaming', 'spiel', 'play', 'stream', 'esport'],
    education: ['learn', 'tutorial', 'how to', 'explain', 'tipps', 'lernen', 'anleitung', 'erklärt'],
    entertainment: ['funny', 'comedy', 'lustig', 'spaß', 'unterhalt'],
    business: ['business', 'money', 'geld', 'marketing', 'unternehm', 'startup', 'invest'],
    fitness: ['fitness', 'workout', 'gym', 'training', 'sport', 'health', 'gesund'],
    food: ['food', 'cook', 'recipe', 'essen', 'koch', 'rezept', 'backen'],
    travel: ['travel', 'trip', 'reise', 'urlaub', 'adventure'],
    music: ['music', 'song', 'musik', 'band', 'artist'],
  };

  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some(keyword => text.includes(keyword))) {
      return category;
    }
  }

  return 'general';
}

function generateHashtags(
  topic: string,
  platform: string,
  script?: string,
  locale: string = 'en'
): string[] {
  const category = detectCategory(topic, script);
  const platformPool = HASHTAG_POOLS[platform] || HASHTAG_POOLS.youtube;
  const limit = PLATFORM_LIMITS[platform] || 15;

  // Collect hashtags from different sources
  const hashtags: Set<string> = new Set();

  // Add general platform hashtags
  (platformPool.general || []).forEach(h => hashtags.add(h));

  // Add category-specific hashtags
  (platformPool[category] || []).forEach(h => hashtags.add(h));

  // Add German hashtags if locale is German
  if (locale === 'de') {
    (GERMAN_HASHTAGS.general || []).forEach(h => hashtags.add(h));
    (GERMAN_HASHTAGS[category] || []).forEach(h => hashtags.add(h));
  }

  // Generate topic-based hashtags
  const topicWords = topic
    .split(/\s+/)
    .filter(word => word.length > 3)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .slice(0, 3);

  topicWords.forEach(word => {
    if (/^[a-zA-ZäöüÄÖÜß]+$/.test(word)) {
      hashtags.add(word);
    }
  });

  // Convert to array and limit
  return Array.from(hashtags).slice(0, limit);
}

export async function POST(request: NextRequest) {
  try {
    // Auth check
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { topic, platform, script, locale = 'de' } = body;

    if (!topic) {
      return NextResponse.json(
        { error: 'Topic is required' },
        { status: 400 }
      );
    }

    if (!platform) {
      return NextResponse.json(
        { error: 'Platform is required' },
        { status: 400 }
      );
    }

    const validPlatforms = ['youtube', 'tiktok', 'instagram'];
    if (!validPlatforms.includes(platform)) {
      return NextResponse.json(
        { error: `Invalid platform. Must be one of: ${validPlatforms.join(', ')}` },
        { status: 400 }
      );
    }

    const hashtags = generateHashtags(topic, platform, script, locale);

    return NextResponse.json({
      success: true,
      hashtags,
      platform,
      count: hashtags.length,
    });
  } catch (error) {
    console.error('Hashtag generation error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Hashtag generation failed',
      },
      { status: 500 }
    );
  }
}
