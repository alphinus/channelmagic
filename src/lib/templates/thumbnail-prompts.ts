import type { Platform } from '@/store/wizard-store';

type Locale = 'de' | 'en';

interface ThumbnailParams {
  topic: string;
  platform: Platform;
  locale: Locale;
  niche?: string;
  emotion?: 'curiosity' | 'shock' | 'excitement' | 'trust';
}

const emotionInstructions = {
  de: {
    curiosity: 'Neugier wecken durch Fragen oder Geheimnisse',
    shock: 'Überraschung durch kontrastierende Elemente oder unerwartete Fakten',
    excitement: 'Begeisterung durch dynamische Farben und Action',
    trust: 'Vertrauen durch professionelles, sauberes Design',
  },
  en: {
    curiosity: 'Spark curiosity through questions or mysteries',
    shock: 'Create surprise through contrasting elements or unexpected facts',
    excitement: 'Generate excitement through dynamic colors and action',
    trust: 'Build trust through professional, clean design',
  },
};

const platformSpecs = {
  youtube: { width: 1280, height: 720, ratio: '16:9' },
  tiktok: { width: 1080, height: 1920, ratio: '9:16' },
  instagram: { width: 1080, height: 1350, ratio: '4:5' },
};

export function generateThumbnailPrompt(params: ThumbnailParams): string {
  const { topic, platform, locale, niche, emotion = 'curiosity' } = params;

  const specs = platformSpecs[platform];

  if (locale === 'de') {
    return `Erstelle ein aufmerksamkeitsstarkes Thumbnail-Design für ${platform.toUpperCase()}${niche ? ` im Bereich ${niche}` : ''}.

THEMA: ${topic}
FORMAT: ${specs.width}x${specs.height}px (${specs.ratio})
EMOTION: ${emotionInstructions.de[emotion]}

DESIGN-ANFORDERUNGEN:
1. **TEXT**: Maximal 3-5 Wörter in großer, fetter Schrift
   - Verwende kontrastreiche Farben (z.B. Gelb/Weiß auf dunklem Hintergrund)
   - Füge Text-Outlines oder Schatten für bessere Lesbarkeit hinzu

2. **VISUELLE ELEMENTE**:
   - Hauptbild/Person in der vorderen Hälfte
   - Gesichtsausdruck zeigt Emotion (überrascht, neugierig, aufgeregt)
   - Hintergrund leicht unscharf für Fokus

3. **FARBEN**:
   - Verwende maximal 3 Hauptfarben
   - Hoher Kontrast für mobile Ansicht
   ${platform === 'youtube' ? '- YouTube-freundliche Farben (Rot, Gelb, Blau)' : ''}

4. **KOMPOSITION**:
   - Regel der Drittel anwenden
   - Wichtigste Elemente im oberen/mittleren Bereich
   ${platform === 'tiktok' ? '- Unteren Bereich freilassen (TikTok UI)' : ''}

TOOLS ZUM ERSTELLEN:
- Canva: Verwende Template-Suche "${topic} thumbnail"
- Photopea: Freie Photoshop-Alternative
- Figma: Für präzises Design

DESIGN-BESCHREIBUNG:`;
  }

  return `Create an attention-grabbing thumbnail design for ${platform.toUpperCase()}${niche ? ` in the ${niche} niche` : ''}.

TOPIC: ${topic}
FORMAT: ${specs.width}x${specs.height}px (${specs.ratio})
EMOTION: ${emotionInstructions.en[emotion]}

DESIGN REQUIREMENTS:
1. **TEXT**: Maximum 3-5 words in large, bold font
   - Use high-contrast colors (e.g., Yellow/White on dark background)
   - Add text outlines or shadows for better readability

2. **VISUAL ELEMENTS**:
   - Main image/person in the front half
   - Facial expression shows emotion (surprised, curious, excited)
   - Background slightly blurred for focus

3. **COLORS**:
   - Use maximum 3 main colors
   - High contrast for mobile view
   ${platform === 'youtube' ? '- YouTube-friendly colors (Red, Yellow, Blue)' : ''}

4. **COMPOSITION**:
   - Apply rule of thirds
   - Most important elements in upper/middle area
   ${platform === 'tiktok' ? '- Leave lower area free (TikTok UI)' : ''}

TOOLS TO CREATE:
- Canva: Use template search "${topic} thumbnail"
- Photopea: Free Photoshop alternative
- Figma: For precise design

DESIGN DESCRIPTION:`;
}
