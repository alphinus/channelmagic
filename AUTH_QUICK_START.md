# Authentication Quick Start Guide

## 1. Supabase Datenbank Setup

### Option A: Automatisches Setup
Führe die SQL-Datei in deinem Supabase SQL Editor aus:

1. Öffne Supabase Dashboard: https://supabase.com/dashboard
2. Wähle dein Projekt
3. Gehe zu "SQL Editor"
4. Kopiere den Inhalt von `supabase-setup.sql`
5. Führe die Queries aus

### Option B: Manuelles Setup
Siehe `AUTHENTICATION.md` für detaillierte Anweisungen.

## 2. Supabase Email Settings

1. Gehe zu Authentication → Providers
2. Enable Email Provider
3. Optional: Enable "Confirm email"

### Email Templates (Authentication → Email Templates)

**Confirm signup Template:**
```html
<h2>Bestätige deine E-Mail</h2>
<p>Klicke auf den Link um deinen Account zu aktivieren:</p>
<a href="{{ .ConfirmationURL }}">E-Mail bestätigen</a>
```

## 3. Supabase URL Configuration

1. Gehe zu Authentication → URL Configuration
2. Setze Site URL: `http://localhost:3000` (Development)
3. Füge Redirect URLs hinzu:
   - `http://localhost:3000/auth/callback`
   - `http://localhost:3000/**` (für alle Redirects)

Für Production:
   - `https://deine-domain.com/auth/callback`
   - `https://deine-domain.com/**`

## 4. Test Authentication

### Start Development Server
```bash
npm run dev
```

### Test Flows

1. **Registrierung:**
   - Gehe zu http://localhost:3000/auth/signup
   - Registriere einen neuen User
   - Prüfe Email-Postfach für Bestätigungslink
   - Klicke auf Link (redirect zu /auth/callback)

2. **Login:**
   - Gehe zu http://localhost:3000/auth/login
   - Melde dich mit Email + Password an
   - Sollte zu /wizard/channel-setup oder /dashboard redirecten

3. **AuthModal:**
   - Implementiere in einer Komponente (siehe Beispiele unten)
   - Teste Login/Signup Flow im Modal

## 5. Integration Beispiele

### Beispiel 1: Protected Page
```tsx
// src/app/dashboard/page.tsx
import { createSupabaseServerClient } from "@/lib/db/server-client"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Willkommen, {user.email}</p>
    </div>
  )
}
```

### Beispiel 2: Client Component mit AuthModal
```tsx
// src/app/wizard/channel-setup/page.tsx
"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/db/client"
import { AuthModal } from "@/components/auth/AuthModal"
import { Button } from "@/components/ui/button"

export default function ChannelSetupPage() {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const supabase = createClient()

    // Get initial user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const handleSave = async () => {
    if (!user) {
      setShowAuthModal(true)
      return
    }

    // Speichern-Logik hier
    console.log("Saving...", user.id)
  }

  return (
    <div>
      <h1>Channel Setup</h1>
      <Button onClick={handleSave}>
        Einstellungen speichern
      </Button>

      <AuthModal
        open={showAuthModal}
        onOpenChange={setShowAuthModal}
        redirectAfterAuth="/wizard/channel-setup"
      />
    </div>
  )
}
```

### Beispiel 3: Logout Button
```tsx
// src/components/LogoutButton.tsx
"use client"

import { createClient } from "@/lib/db/client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/auth/login")
    router.refresh()
  }

  return (
    <Button onClick={handleLogout} variant="outline">
      Abmelden
    </Button>
  )
}
```

### Beispiel 4: User Info anzeigen
```tsx
// src/components/UserProfile.tsx
"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/db/client"
import type { User } from "@supabase/supabase-js"

export function UserProfile() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  if (!user) {
    return <div>Nicht angemeldet</div>
  }

  return (
    <div>
      <p>Email: {user.email}</p>
      <p>User ID: {user.id}</p>
    </div>
  )
}
```

## 6. Troubleshooting

### "Invalid login credentials"
- Prüfe ob Email/Password korrekt sind
- Prüfe ob User in Supabase existiert (Authentication → Users)
- Prüfe ob Email bestätigt wurde

### "Email not confirmed"
- Aktiviere in Supabase: Authentication → Providers → Email → "Confirm email"
- Sende neue Bestätigungs-Email
- Prüfe Spam-Ordner

### Redirect funktioniert nicht
- Prüfe Supabase URL Configuration
- Prüfe ob Redirect URL whitelisted ist
- Prüfe Browser Console für Fehler

### Middleware Probleme
- Prüfe ob `middleware.ts` im `src/` Verzeichnis liegt
- Prüfe Console für Middleware-Fehler
- Verifiziere Cookie-Settings in Browser

### Session wird nicht gespeichert
- Prüfe ob Cookies aktiviert sind
- Prüfe ob `createSupabaseServerClient()` korrekt verwendet wird
- Prüfe Supabase Logs im Dashboard

## 7. Nächste Schritte

Nach erfolgreichem Setup:

1. **Profile Completion:**
   - Erweitere `profiles` Tabelle mit zusätzlichen Feldern
   - Erstelle Profile-Edit Seite
   - Implementiere Avatar Upload

2. **Social Auth (Optional):**
   - Konfiguriere OAuth Provider (Google, GitHub, etc.)
   - Füge Social Login Buttons hinzu
   - Update AuthModal mit Social Buttons

3. **Password Reset:**
   - Implementiere "Passwort vergessen" Flow
   - Email Template konfigurieren
   - Reset-Seite erstellen

4. **Email Verification:**
   - Implementiere Re-send Verification Email
   - Notification wenn Email nicht verifiziert
   - Automatischer Logout bei fehlender Verifikation

## 8. Production Deployment

Vor Production Deploy:

- [ ] Supabase Production URLs konfigurieren
- [ ] Email Templates anpassen (Branding)
- [ ] Rate Limiting aktivieren
- [ ] RLS Policies überprüfen
- [ ] Session Timeout konfigurieren
- [ ] Error Monitoring einrichten
- [ ] HTTPS erzwingen
- [ ] Cookie Settings überprüfen (Secure, SameSite)

## Hilfreiche Links

- Supabase Auth Docs: https://supabase.com/docs/guides/auth
- Next.js 15 App Router: https://nextjs.org/docs/app
- Radix UI: https://www.radix-ui.com/
- shadcn/ui: https://ui.shadcn.com/
