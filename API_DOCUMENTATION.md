# ChannelMagic API Documentation

## Übersicht

Die ChannelMagic API bietet Endpoints für die Validierung von API-Keys, Script-Generierung und Video-Erstellung.

## API Endpoints

### 1. OpenRouter API Key Validierung

**Endpoint:** `POST /api/validate/openrouter`

**Request:**
```json
{
  "apiKey": "sk-or-v1-..."
}
```

**Response (Success):**
```json
{
  "valid": true,
  "models": 150
}
```

**Response (Error):**
```json
{
  "valid": false,
  "error": "Invalid API key"
}
```

---

### 2. HeyGen API Key Validierung

**Endpoint:** `POST /api/validate/heygen`

**Request:**
```json
{
  "apiKey": "your-heygen-api-key"
}
```

**Response (Success):**
```json
{
  "valid": true,
  "quota": 1000
}
```

**Response (Error):**
```json
{
  "valid": false,
  "error": "Invalid API key"
}
```

---

### 3. Script-Generierung

**Endpoint:** `POST /api/generate/script`

**Request:**
```json
{
  "apiKey": "sk-or-v1-...",
  "topic": "Die Zukunft der KI",
  "style": "educational",
  "duration": "short",
  "platform": "youtube",
  "locale": "de",
  "niche": "Technology",
  "targetAudience": "Tech-Enthusiasten"
}
```

**Parameter:**
- `apiKey` (required): OpenRouter API Key
- `topic` (required): Thema des Videos
- `style` (required): `"educational"` | `"entertaining"` | `"inspirational"`
- `duration` (required): `"short"` (60 Sek) | `"long"` (5-8 Min)
- `platform` (required): `"youtube"` | `"tiktok"` | `"instagram"`
- `locale` (required): `"de"` | `"en"`
- `niche` (optional): Nische/Bereich
- `targetAudience` (optional): Zielgruppe

**Response (Success):**
```json
{
  "success": true,
  "script": "**HOOK**: Wusstest du, dass KI bald...\n[SZENENANWEISUNG: Dynamischer Einstieg]..."
}
```

**Response (Error):**
```json
{
  "error": "Missing required field: topic"
}
```

---

### 4. Video-Generierung

**Endpoint:** `POST /api/generate/video`

**Request:**
```json
{
  "apiKey": "your-heygen-api-key",
  "script": "Das ist der Videotext...",
  "avatarId": "avatar_id_123",
  "voiceId": "voice_id_456",
  "backgroundColor": "#000000"
}
```

**Parameter:**
- `apiKey` (required): HeyGen API Key
- `script` (required): Der Video-Script-Text
- `avatarId` (optional): HeyGen Avatar ID
- `voiceId` (optional): HeyGen Voice ID
- `backgroundColor` (optional): Hintergrundfarbe (Hex)

**Response (Success):**
```json
{
  "success": true,
  "videoId": "video_abc123"
}
```

**Response (Error):**
```json
{
  "error": "Script is required"
}
```

---

### 5. Video-Status abfragen

**Endpoint:** `GET /api/video/status?apiKey=xxx&videoId=xxx`

**Query Parameters:**
- `apiKey`: HeyGen API Key
- `videoId`: Video ID von der Video-Generierung

**Response (Success):**
```json
{
  "success": true,
  "status": {
    "status": "completed",
    "video_url": "https://heygen.com/videos/abc123.mp4"
  }
}
```

**Status-Werte:**
- `pending`: Video wird vorbereitet
- `processing`: Video wird generiert
- `completed`: Video ist fertig
- `failed`: Fehler bei der Generierung

**Response (Error):**
```json
{
  "error": "Video ID required"
}
```

---

## TypeScript Types

Alle API-Typen sind in `/src/types/api.ts` definiert:

```typescript
import type {
  ValidationResponse,
  ScriptGenerationRequest,
  ScriptGenerationResponse,
  VideoGenerationRequest,
  VideoGenerationResponse,
  VideoStatusResponse,
} from '@/types/api';
```

---

## Services

### OpenRouter Service

```typescript
import { generateScript, validateOpenRouterKey } from '@/lib/services/openrouter';

// Script generieren
const script = await generateScript(apiKey, {
  topic: 'KI in der Medizin',
  style: 'educational',
  duration: 'long',
  platform: 'youtube',
  locale: 'de',
});

// API Key validieren
const isValid = await validateOpenRouterKey(apiKey);
```

### HeyGen Service

```typescript
import {
  createVideo,
  getVideoStatus,
  getRemainingQuota,
  validateHeyGenKey,
} from '@/lib/services/heygen';

// Video erstellen
const videoId = await createVideo(apiKey, {
  script: 'Mein Video-Script...',
  avatarId: 'avatar_123',
});

// Status prüfen
const status = await getVideoStatus(apiKey, videoId);

// Quota prüfen
const quota = await getRemainingQuota(apiKey);

// API Key validieren
const isValid = await validateHeyGenKey(apiKey);
```

---

## Verwendung im Frontend

```typescript
// OpenRouter Key validieren
const validateOpenRouter = async (apiKey: string) => {
  const response = await fetch('/api/validate/openrouter', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ apiKey }),
  });
  return response.json();
};

// Script generieren
const generateScript = async (params: ScriptGenerationRequest) => {
  const response = await fetch('/api/generate/script', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  return response.json();
};

// Video erstellen
const createVideo = async (params: VideoGenerationRequest) => {
  const response = await fetch('/api/generate/video', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  return response.json();
};

// Video-Status prüfen
const checkVideoStatus = async (apiKey: string, videoId: string) => {
  const response = await fetch(
    `/api/video/status?apiKey=${apiKey}&videoId=${videoId}`
  );
  return response.json();
};
```

---

## Error Handling

Alle API Endpoints geben bei Fehlern folgendes Format zurück:

```json
{
  "error": "Fehlerbeschreibung"
}
```

**Häufige Fehler:**
- `400`: Fehlende oder ungültige Parameter
- `401`: Ungültiger API Key
- `500`: Server-Fehler (z.B. externe API nicht erreichbar)

---

## Sicherheitshinweise

- API Keys sollten NIEMALS im Frontend gespeichert werden
- Verwende Umgebungsvariablen für API Keys in der Produktion
- Alle API Calls validieren die API Keys bei jedem Request
- Rate Limiting wird von OpenRouter und HeyGen selbst verwaltet
