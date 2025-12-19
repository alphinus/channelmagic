# Auth Components

## AuthModal

Die `AuthModal` Komponente ist ein wiederverwendbares Modal für Login und Registrierung.

### Verwendung

```tsx
"use client"

import { useState } from "react"
import { AuthModal } from "@/components/auth/AuthModal"
import { Button } from "@/components/ui/button"

export function ExampleComponent() {
  const [showAuthModal, setShowAuthModal] = useState(false)

  const handleSaveClick = () => {
    // Prüfen ob User eingeloggt ist
    // Wenn nicht, Modal öffnen
    setShowAuthModal(true)
  }

  return (
    <>
      <Button onClick={handleSaveClick}>
        Speichern
      </Button>

      <AuthModal
        open={showAuthModal}
        onOpenChange={setShowAuthModal}
        redirectAfterAuth="/wizard/channel-setup"
      />
    </>
  )
}
```

### Props

- `open: boolean` - Steuert ob das Modal geöffnet ist
- `onOpenChange: (open: boolean) => void` - Callback wenn sich der Open-State ändert
- `redirectAfterAuth?: string` - Wohin soll nach erfolgreicher Auth redirected werden (default: `/wizard/channel-setup`)

### Features

- Tab-basierte UI mit Login und Signup
- Automatische Validation (Email, Passwort-Match, Passwort-Länge)
- Error Handling
- Success State für Signup mit Email-Bestätigung
- Automatischer Redirect nach Login
- Prüft ob User bereits Onboarding abgeschlossen hat
- Dark Mode Support
