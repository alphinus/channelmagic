import type { Platform } from '@/store/wizard-store';

type Locale = 'de' | 'en';

interface VideoParams {
  topic: string;
  platform: Platform;
  locale: Locale;
  duration?: 'short' | 'long';
}

const platformSpecs = {
  youtube: { format: '16:9', resolution: '1920x1080' },
  tiktok: { format: '9:16', resolution: '1080x1920' },
  instagram: { format: '9:16', resolution: '1080x1920' },
};

export function generateVideoPrompt(params: VideoParams): string {
  const { topic, platform, locale, duration = 'short' } = params;
  const specs = platformSpecs[platform];

  if (locale === 'de') {
    return `Erstelle jetzt dein Video für ${platform.toUpperCase()} zum Thema "${topic}".

FORMAT: ${specs.format} (${specs.resolution})
LÄNGE: ${duration === 'short' ? '60 Sekunden' : '5-8 Minuten'}

EMPFOHLENE VIDEO-EDITING TOOLS:

1. **CapCut** (Kostenlos, Einfach)
   - Desktop & Mobile verfügbar
   - AI-Features (Auto-Captions, Effects)
   - Templates für schnellen Start
   - Perfekt für Anfänger

2. **DaVinci Resolve** (Kostenlos, Profi)
   - Professionelle Features
   - Nur Desktop
   - Steile Lernkurve

3. **Descript** (Freemium)
   - Text-basiertes Editing
   - Auto-Transcription
   - Sehr intuitiv

VIDEO-EDITING WORKFLOW:
1. Import deiner Clips/B-Roll
2. Voiceover hinzufügen
3. Visuals zum Voiceover synchronisieren
4. Captions/Untertitel hinzufügen (wichtig!)
5. Musik und Sound Effects
6. Color Grading (optional)
7. Export in ${specs.resolution}

WICHTIGE TIPPS:
- Erste 3 Sekunden sind KRITISCH (Hook!)
- Nutze Captions (80% schauen ohne Ton)
- Dynamische Cuts halten Aufmerksamkeit
${platform === 'tiktok' || platform === 'instagram' ? '- Vertikales Format (9:16)\n- Trend-Sounds verwenden' : ''}
${platform === 'youtube' ? '- Gute Thumbnail-Momente einbauen\n- Chapter-Markers setzen' : ''}

B-ROLL QUELLEN (kostenlos):
- Pexels Videos
- Pixabay
- Coverr
- Mixkit`;
  }

  return `Create your video for ${platform.toUpperCase()} on "${topic}".

FORMAT: ${specs.format} (${specs.resolution})
LENGTH: ${duration === 'short' ? '60 seconds' : '5-8 minutes'}

RECOMMENDED VIDEO EDITING TOOLS:

1. **CapCut** (Free, Easy)
   - Desktop & Mobile available
   - AI Features (Auto-Captions, Effects)
   - Templates for quick start
   - Perfect for beginners

2. **DaVinci Resolve** (Free, Pro)
   - Professional features
   - Desktop only
   - Steep learning curve

3. **Descript** (Freemium)
   - Text-based editing
   - Auto-transcription
   - Very intuitive

VIDEO EDITING WORKFLOW:
1. Import your clips/B-Roll
2. Add voiceover
3. Sync visuals to voiceover
4. Add captions/subtitles (important!)
5. Music and sound effects
6. Color grading (optional)
7. Export in ${specs.resolution}

IMPORTANT TIPS:
- First 3 seconds are CRITICAL (Hook!)
- Use captions (80% watch without sound)
- Dynamic cuts maintain attention
${platform === 'tiktok' || platform === 'instagram' ? '- Vertical format (9:16)\n- Use trending sounds' : ''}
${platform === 'youtube' ? '- Include good thumbnail moments\n- Set chapter markers' : ''}

B-ROLL SOURCES (free):
- Pexels Videos
- Pixabay
- Coverr
- Mixkit`;
}
