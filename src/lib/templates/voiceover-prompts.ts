type Locale = 'de' | 'en';

interface VoiceoverParams {
  topic: string;
  locale: Locale;
  script?: string;
}

export function generateVoiceoverPrompt(params: VoiceoverParams): string {
  const { topic, locale, script } = params;

  if (locale === 'de') {
    return `Für das Video zum Thema "${topic}" benötigst du jetzt einen Voiceover.

${script ? `DEIN SCRIPT:\n${script}\n\n` : ''}EMPFOHLENE TOOLS FÜR VOICEOVER:

1. **ElevenLabs** (AI Voice)
   - Sehr natürlich klingende Stimmen
   - Mehrsprachig verfügbar
   - Freemium: 10.000 Zeichen/Monat kostenlos

2. **Murf.ai** (AI Voice)
   - Professionelle Stimmen
   - Voice Cloning möglich
   - Trial verfügbar

3. **Eigene Aufnahme**
   - Audacity (kostenlos, Desktop)
   - Voice Recorder auf Smartphone
   - Für authentischen Touch

TIPPS FÜR GUTEN VOICEOVER:
- Sprich langsam und deutlich
- Mach Pausen an wichtigen Stellen
- Betone wichtige Wörter
- Reduziere Hintergrundgeräusche
- Export als MP3 oder WAV`;
  }

  return `For the video on "${topic}" you now need a voiceover.

${script ? `YOUR SCRIPT:\n${script}\n\n` : ''}RECOMMENDED VOICEOVER TOOLS:

1. **ElevenLabs** (AI Voice)
   - Very natural sounding voices
   - Multilingual available
   - Freemium: 10,000 characters/month free

2. **Murf.ai** (AI Voice)
   - Professional voices
   - Voice cloning possible
   - Trial available

3. **Record Yourself**
   - Audacity (free, desktop)
   - Voice Recorder on smartphone
   - For authentic touch

TIPS FOR GOOD VOICEOVER:
- Speak slowly and clearly
- Pause at important points
- Emphasize key words
- Reduce background noise
- Export as MP3 or WAV`;
}
