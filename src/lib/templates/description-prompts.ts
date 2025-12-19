import type { Platform } from '@/store/wizard-store';

type Locale = 'de' | 'en';

interface DescriptionParams {
  topic: string;
  platform: Platform;
  locale: Locale;
  keywords?: string[];
  includeLinks?: boolean;
  channelName?: string;
}

const platformLimits = {
  youtube: 5000,
  tiktok: 2200,
  instagram: 2200,
};

const platformFeatures = {
  de: {
    youtube: 'Nutze Timestamps, Chapters und ausführliche Beschreibungen',
    tiktok: 'Kurz und prägnant, nutze Hashtags strategisch',
    instagram: 'Community-fokussiert, nutze Line-Breaks für Lesbarkeit',
  },
  en: {
    youtube: 'Use timestamps, chapters and detailed descriptions',
    tiktok: 'Short and concise, use hashtags strategically',
    instagram: 'Community-focused, use line breaks for readability',
  },
};

export function generateDescriptionPrompt(params: DescriptionParams): string {
  const { topic, platform, locale, keywords = [], includeLinks = true, channelName } = params;

  const charLimit = platformLimits[platform];

  if (locale === 'de') {
    return `Erstelle eine optimierte Video-Beschreibung für ${platform.toUpperCase()}.

THEMA: ${topic}
ZEICHENLIMIT: ${charLimit}
${keywords.length > 0 ? `KEYWORDS: ${keywords.join(', ')}` : ''}
${channelName ? `CHANNEL: ${channelName}` : ''}

PLATTFORM-HINWEIS: ${platformFeatures.de[platform]}

STRUKTUR:
1. **HOOK** (erste 1-2 Zeilen): Fasse das Video in einem spannenden Satz zusammen
   - Diese Zeilen sind sichtbar bevor "Mehr anzeigen" geklickt wird
   - Nutze relevante Keywords natürlich

2. **HAUPTBESCHREIBUNG**:
   - Erkläre worum es im Video geht (2-3 Absätze)
   - Nutze Absätze für bessere Lesbarkeit
   - Integriere Keywords organisch
   ${platform === 'youtube' ? '- Füge Timestamps hinzu (z.B. "0:00 Intro")\n   - Erwähne was der Zuschauer lernen wird' : ''}

3. **CALL-TO-ACTION**:
   - Aufforderung zum Abonnieren/Folgen
   - Frage zur Interaktion in den Kommentaren
   ${platform === 'youtube' ? '- Hinweis auf andere relevante Videos' : ''}

${includeLinks ? `4. **LINKS** (falls vorhanden):
   - Social Media Kanäle
   - Erwähnte Tools/Resources
   - Affiliate Links (markiert als Werbung)
` : ''}

5. **HASHTAGS**:
   ${platform === 'youtube' ? '- 3-5 relevante Hashtags am Ende' : ''}
   ${platform === 'tiktok' ? '- 5-10 Hashtags (Mix aus trending und niche-spezifisch)' : ''}
   ${platform === 'instagram' ? '- 20-30 Hashtags (Mix aus groß, mittel, klein)' : ''}

WICHTIG:
- Schreibe natürlich, nicht wie ein Robot
- Erste Zeile ist am wichtigsten für SEO
- Nutze Emojis sparsam für visuelle Struktur
${platform === 'youtube' ? '- YouTube zeigt nur erste 100-150 Zeichen in der Suche' : ''}

Beginne mit der Beschreibung:`;
  }

  return `Create an optimized video description for ${platform.toUpperCase()}.

TOPIC: ${topic}
CHARACTER LIMIT: ${charLimit}
${keywords.length > 0 ? `KEYWORDS: ${keywords.join(', ')}` : ''}
${channelName ? `CHANNEL: ${channelName}` : ''}

PLATFORM NOTE: ${platformFeatures.en[platform]}

STRUCTURE:
1. **HOOK** (first 1-2 lines): Summarize the video in one exciting sentence
   - These lines are visible before "Show more" is clicked
   - Use relevant keywords naturally

2. **MAIN DESCRIPTION**:
   - Explain what the video is about (2-3 paragraphs)
   - Use paragraphs for better readability
   - Integrate keywords organically
   ${platform === 'youtube' ? '- Add timestamps (e.g., "0:00 Intro")\n   - Mention what the viewer will learn' : ''}

3. **CALL-TO-ACTION**:
   - Ask to subscribe/follow
   - Question to encourage comments
   ${platform === 'youtube' ? '- Reference to other relevant videos' : ''}

${includeLinks ? `4. **LINKS** (if applicable):
   - Social media channels
   - Mentioned tools/resources
   - Affiliate links (marked as advertising)
` : ''}

5. **HASHTAGS**:
   ${platform === 'youtube' ? '- 3-5 relevant hashtags at the end' : ''}
   ${platform === 'tiktok' ? '- 5-10 hashtags (mix of trending and niche-specific)' : ''}
   ${platform === 'instagram' ? '- 20-30 hashtags (mix of large, medium, small)' : ''}

IMPORTANT:
- Write naturally, not like a robot
- First line is most important for SEO
- Use emojis sparingly for visual structure
${platform === 'youtube' ? '- YouTube only shows first 100-150 characters in search' : ''}

Start the description:`;
}
