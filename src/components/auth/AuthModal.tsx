"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/db/client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckCircle2 } from "lucide-react"

interface AuthModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  redirectAfterAuth?: string
}

export function AuthModal({ open, onOpenChange, redirectAfterAuth = "/wizard/channel-setup" }: AuthModalProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login")

  // Login state
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [loginError, setLoginError] = useState<string | null>(null)
  const [loginLoading, setLoginLoading] = useState(false)

  // Signup state
  const [signupEmail, setSignupEmail] = useState("")
  const [signupPassword, setSignupPassword] = useState("")
  const [signupPasswordConfirm, setSignupPasswordConfirm] = useState("")
  const [signupError, setSignupError] = useState<string | null>(null)
  const [signupLoading, setSignupLoading] = useState(false)
  const [signupSuccess, setSignupSuccess] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError(null)
    setLoginLoading(true)

    try {
      const supabase = createClient()
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      })

      if (signInError) {
        setLoginError(signInError.message)
        setLoginLoading(false)
        return
      }

      if (data.user) {
        // Check if user has completed onboarding
        const { data: profile } = await supabase
          .from('profiles')
          .select('onboarding_completed')
          .eq('id', data.user.id)
          .single()

        onOpenChange(false)

        if (profile?.onboarding_completed) {
          router.push('/dashboard')
        } else {
          router.push(redirectAfterAuth)
        }
        router.refresh()
      }
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten')
      setLoginLoading(false)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setSignupError(null)
    setSignupLoading(true)

    // Validate password match
    if (signupPassword !== signupPasswordConfirm) {
      setSignupError("Die Passwörter stimmen nicht überein")
      setSignupLoading(false)
      return
    }

    // Validate password length
    if (signupPassword.length < 6) {
      setSignupError("Das Passwort muss mindestens 6 Zeichen lang sein")
      setSignupLoading(false)
      return
    }

    try {
      const supabase = createClient()
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: signupEmail,
        password: signupPassword,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${redirectAfterAuth}`,
        },
      })

      if (signUpError) {
        setSignupError(signUpError.message)
        setSignupLoading(false)
        return
      }

      if (data.user) {
        // Check if email confirmation is required
        if (data.user.identities && data.user.identities.length === 0) {
          setSignupError("Diese E-Mail-Adresse ist bereits registriert")
          setSignupLoading(false)
          return
        }

        setSignupSuccess(true)
        setSignupLoading(false)
      }
    } catch (err) {
      setSignupError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten')
      setSignupLoading(false)
    }
  }

  const resetSignupSuccess = () => {
    setSignupSuccess(false)
    setSignupEmail("")
    setSignupPassword("")
    setSignupPasswordConfirm("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Anmelden oder Registrieren</DialogTitle>
          <DialogDescription>
            Melde dich an, um deine Einstellungen zu speichern
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "login" | "signup")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Anmelden</TabsTrigger>
            <TabsTrigger value="signup">Registrieren</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-4">
            <form onSubmit={handleLogin} className="space-y-4">
              {loginError && (
                <div className="rounded-md bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
                  {loginError}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="login-email">E-Mail</Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="deine@email.de"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                  autoComplete="email"
                  disabled={loginLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="login-password">Passwort</Label>
                <Input
                  id="login-password"
                  type="password"
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  disabled={loginLoading}
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loginLoading}
              >
                {loginLoading ? "Wird angemeldet..." : "Anmelden"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup" className="space-y-4">
            {signupSuccess ? (
              <div className="space-y-4 text-center py-4">
                <div className="flex justify-center">
                  <CheckCircle2 className="size-12 text-green-500" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">Registrierung erfolgreich!</h3>
                  <p className="text-sm text-muted-foreground">
                    Wir haben dir eine Bestätigungs-E-Mail gesendet. Bitte überprüfe dein Postfach.
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    resetSignupSuccess()
                    setActiveTab("login")
                  }}
                >
                  Zur Anmeldung
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSignup} className="space-y-4">
                {signupError && (
                  <div className="rounded-md bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
                    {signupError}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="signup-email">E-Mail</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="deine@email.de"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    required
                    autoComplete="email"
                    disabled={signupLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password">Passwort</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="••••••••"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                    disabled={signupLoading}
                  />
                  <p className="text-xs text-muted-foreground">
                    Mindestens 6 Zeichen
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password-confirm">Passwort bestätigen</Label>
                  <Input
                    id="signup-password-confirm"
                    type="password"
                    placeholder="••••••••"
                    value={signupPasswordConfirm}
                    onChange={(e) => setSignupPasswordConfirm(e.target.value)}
                    required
                    autoComplete="new-password"
                    disabled={signupLoading}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={signupLoading}
                >
                  {signupLoading ? "Wird registriert..." : "Registrieren"}
                </Button>
              </form>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
