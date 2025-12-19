import type { Platform } from '@/store/wizard-store';

type Style = 'educational' | 'entertaining' | 'inspirational';
type Duration = 'short' | 'long';
type Locale = 'de' | 'en';

interface ScriptParams {
  topic: string;
  style: Style;
  duration: Duration;
  platform: Platform;
  locale: Locale;
  niche?: string;
  targetAudience?: string;
}

const styleInstructions = {
  de: {
    educational: 'informativ und lehrreich, mit klaren Fakten und Erklärungen',
    entertaining: 'unterhaltsam und humorvoll, mit persönlichen Anekdoten',
    inspirational: 'motivierend und inspirierend, mit emotionalen Momenten',
  },
  en: {
    educational: 'informative and educational, with clear facts and explanations',
    entertaining: 'entertaining and humorous, with personal anecdotes',
    inspirational: 'motivating and inspiring, with emotional moments',
  },
};

const platformHints = {
  de: {
    youtube: 'Längere, ausführliche Erklärungen sind ok. Nutze Chapter-Struktur.',
    tiktok: 'Schnell, trend-fokussiert, direkt auf den Punkt. Hook in ersten 2 Sekunden!',
    instagram: 'Ästhetisch, community-fokussiert. Frage am Ende zur Interaktion.',
  },
  en: {
    youtube: 'Longer, detailed explanations are ok. Use chapter structure.',
    tiktok: 'Fast, trend-focused, straight to the point. Hook in first 2 seconds!',
    instagram: 'Aesthetic, community-focused. Ask a question at the end for engagement.',
  },
};

export function generateScriptPrompt(params: ScriptParams): string {
  const { topic, style, duration, platform, locale, niche, targetAudience } = params;

  const lang = locale === 'de' ? 'Deutsch' : 'English';
  const durationText = locale === 'de'
    ? (duration === 'short' ? '60 Sekunden (Short/Reel)' : '5-8 Minuten')
    : (duration === 'short' ? '60 seconds (Short/Reel)' : '5-8 minutes');

  if (locale === 'de') {
    return `Du bist ein erfahrener ${platform.toUpperCase()} Content Creator${niche ? ` im Bereich ${niche}` : ''}.

Erstelle ein vollständiges Video-Script, das ${styleInstructions.de[style]} ist.

THEMA: ${topic}
LÄNGE: ${durationText}
SPRACHE: ${lang}
${targetAudience ? `ZIELGRUPPE: ${targetAudience}` : ''}

PLATTFORM-HINWEIS: ${platformHints.de[platform]}

STRUKTUR:
1. **HOOK** (erste 3 Sekunden): Eine provokante Frage oder überraschende Aussage
2. **INTRO** (10-15 Sek): Kurze Vorstellung des Themas
3. **HAUPTTEIL**: ${duration === 'short' ? '2-3 kurze Punkte' : '3-5 ausführliche Punkte'}
4. **CALL-TO-ACTION**: Aufforderung zum Liken/Abonnieren/Kommentieren
5. **OUTRO**: Kurzer Abschluss

Formatiere das Script so:
- Schreibe gesprochenen Text (kein Stichpunkte)
- Füge [SZENENANWEISUNG] für visuelle Hinweise hinzu
- Markiere wichtige Wörter zum **Betonen**

Beginne jetzt mit dem Script:`;
  }

  return `You are an experienced ${platform.toUpperCase()} content creator${niche ? ` in the ${niche} niche` : ''}.

Create a complete video script that is ${styleInstructions.en[style]}.

TOPIC: ${topic}
LENGTH: ${durationText}
LANGUAGE: ${lang}
${targetAudience ? `TARGET AUDIENCE: ${targetAudience}` : ''}

PLATFORM NOTE: ${platformHints.en[platform]}

STRUCTURE:
1. **HOOK** (first 3 seconds): A provocative question or surprising statement
2. **INTRO** (10-15 sec): Brief introduction to the topic
3. **MAIN CONTENT**: ${duration === 'short' ? '2-3 short points' : '3-5 detailed points'}
4. **CALL-TO-ACTION**: Ask to like/subscribe/comment
5. **OUTRO**: Brief closing

Format the script like this:
- Write spoken text (not bullet points)
- Add [SCENE DIRECTION] for visual hints
- Mark important words to **emphasize**

Start the script now:`;
}
