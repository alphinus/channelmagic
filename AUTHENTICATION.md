# ChannelMagic - Supabase Authentication

Vollständige Implementierung der Supabase Authentication für das ChannelMagic Projekt.

## Übersicht

Die Authentication verwendet Supabase Auth mit Email/Password und unterstützt:
- Login
- Registrierung mit Email-Bestätigung
- Session Management
- Protected Routes via Middleware
- Wiederverwendbare AuthModal Komponente

## Dateistruktur

```
/Users/mg1/Projects/channelmagic/
├── src/
│   ├── lib/
│   │   └── db/
│   │       ├── client.ts              # Client-side Supabase Client
│   │       └── server-client.ts       # Server-side Supabase Client (NEU)
│   ├── app/
│   │   └── auth/
│   │       ├── login/
│   │       │   └── page.tsx           # Login Seite (NEU)
│   │       ├── signup/
│   │       │   └── page.tsx           # Signup Seite (NEU)
│   │       ├── callback/
│   │       │   └── route.ts           # OAuth Callback Handler (NEU)
│   │       └── auth-code-error/
│   │           └── page.tsx           # Error Seite (NEU)
│   ├── components/
│   │   ├── auth/
│   │   │   ├── AuthModal.tsx          # Auth Modal Komponente (NEU)
│   │   │   └── README.md              # Dokumentation (NEU)
│   │   └── ui/
│   │       ├── dialog.tsx             # Dialog Komponente (NEU)
│   │       └── tabs.tsx               # Tabs Komponente (NEU)
│   └── middleware.ts                  # Session Refresh Middleware (NEU)
└── AUTHENTICATION.md                  # Diese Datei (NEU)
```

## Features

### 1. Server-Side Client (`/src/lib/db/server-client.ts`)
- Verwendet `@supabase/ssr` für Server Components
- Cookie-basierte Session-Verwaltung
- Kompatibel mit Next.js 15 App Router

### 2. Login Seite (`/src/app/auth/login/page.tsx`)
- Email + Password Eingabe
- Error Handling
- Link zur Registrierung
- Automatischer Redirect nach Login:
  - Zu `/dashboard` wenn Onboarding abgeschlossen
  - Zu `/wizard/channel-setup` wenn Onboarding noch offen

### 3. Signup Seite (`/src/app/auth/signup/page.tsx`)
- Email + Password + Password Confirm
- Passwort-Validation (min. 6 Zeichen)
- Email-Bestätigungs-Flow
- Success State mit Hinweis auf Email-Bestätigung
- Link zur Login-Seite

### 4. Auth Callback (`/src/app/auth/callback/route.ts`)
- Handhabt Email-Bestätigungs-Links
- Exchange Code für Session
- Intelligenter Redirect basierend auf Onboarding-Status
- Error Handling mit Redirect zu Error-Seite

### 5. AuthModal Komponente (`/src/components/auth/AuthModal.tsx`)
- Wiederverwendbare Modal-Komponente
- Tab-basierte UI (Login / Signup)
- Beide Flows in einem Modal
- Kann überall im Projekt verwendet werden
- Perfekt für "Speichern"-Aktionen die Auth benötigen

**Verwendung:**
```tsx
import { AuthModal } from "@/components/auth/AuthModal"

function MyComponent() {
  const [showAuth, setShowAuth] = useState(false)

  return (
    <>
      <Button onClick={() => setShowAuth(true)}>
        Speichern
      </Button>

      <AuthModal
        open={showAuth}
        onOpenChange={setShowAuth}
        redirectAfterAuth="/wizard/channel-setup"
      />
    </>
  )
}
```

### 6. Middleware (`/src/middleware.ts`)
- Automatisches Session Refresh
- Protected Routes:
  - `/dashboard`
  - `/wizard/channel-setup`
  - `/settings`
- Redirect zu `/auth/login` wenn nicht authentifiziert
- Redirect zu `/dashboard` wenn bereits authentifiziert und auf Auth-Seiten

### 7. UI Komponenten
- `Dialog` - Radix UI Dialog für Modals
- `Tabs` - Radix UI Tabs für Login/Signup Tabs
- Dark Mode Support
- Konsistentes Design mit bestehendem Theme

## Installierte Dependencies

```bash
npm install @radix-ui/react-dialog @radix-ui/react-tabs
```

Bereits vorhanden:
- `@supabase/ssr` (v0.8.0)
- `@supabase/supabase-js` (v2.89.0)

## Environment Variables

In `.env.local` bereits konfiguriert:
```env
NEXT_PUBLIC_SUPABASE_URL=https://lvvtrxuhbidixzdbhmpk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Nächste Schritte

### Supabase Setup
1. Stelle sicher, dass in Supabase folgende Tabelle existiert:
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  onboarding_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);
```

2. Email-Templates konfigurieren (Supabase Dashboard):
   - Authentication → Email Templates
   - "Confirm signup" Template anpassen
   - Redirect URL: `https://deine-domain.com/auth/callback`

3. Auth Settings:
   - Enable Email Provider
   - Optional: Enable Email Confirmations
   - Site URL: `http://localhost:3000` (Development)
   - Redirect URLs:
     - `http://localhost:3000/auth/callback`
     - `https://production-domain.com/auth/callback`

### Integration in bestehenden Code

**Wizard Integration:**
Wenn ein User im Wizard "Speichern" klickt:

```tsx
// src/app/wizard/channel-setup/page.tsx
"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/db/client"
import { AuthModal } from "@/components/auth/AuthModal"

export default function ChannelSetupPage() {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })
  }, [])

  const handleSave = async () => {
    if (!user) {
      setShowAuthModal(true)
      return
    }

    // Speichern-Logik hier
  }

  return (
    <>
      {/* Wizard Content */}
      <Button onClick={handleSave}>Speichern</Button>

      <AuthModal
        open={showAuthModal}
        onOpenChange={setShowAuthModal}
        redirectAfterAuth="/wizard/channel-setup"
      />
    </>
  )
}
```

## Testing

### Lokales Testing

1. Start Development Server:
```bash
npm run dev
```

2. Navigiere zu:
- Login: http://localhost:3000/auth/login
- Signup: http://localhost:3000/auth/signup

3. Teste Flows:
- Registrierung mit Email-Bestätigung
- Login mit existierenden Credentials
- AuthModal in verschiedenen Komponenten
- Protected Routes ohne Authentication

### Production Checklist

- [ ] Supabase Email Templates konfiguriert
- [ ] Production Redirect URLs hinzugefügt
- [ ] RLS Policies für `profiles` Tabelle aktiviert
- [ ] Email Provider aktiviert
- [ ] Rate Limiting konfiguriert
- [ ] OAuth Providers konfiguriert (optional)

## Dark Mode Support

Alle Auth-Komponenten unterstützen das Dark Theme:
- Inputs mit `dark:bg-input/30`
- Error Messages mit `dark:aria-invalid:ring-destructive/40`
- Konsistente Farben mit bestehenden UI-Komponenten

## Sicherheit

- Passwörter mindestens 6 Zeichen
- Email-Bestätigung aktivierbar
- RLS Policies für Datenbankzugriff
- Session-basierte Authentication
- Automatic Session Refresh via Middleware
- Protected Routes via Middleware
- CSRF Protection durch Supabase

## Support

Bei Fragen oder Problemen:
1. Supabase Logs überprüfen
2. Browser Console auf Client-Fehler überprüfen
3. Server Logs auf API-Fehler überprüfen
4. Supabase Dokumentation: https://supabase.com/docs/guides/auth
