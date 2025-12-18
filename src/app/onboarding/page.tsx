"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function OnboardingPage() {
  const router = useRouter();
  const [openrouterKey, setOpenrouterKey] = useState("");
  const [heygenKey, setHeygenKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ openrouter?: string; heygen?: string }>({});

  async function validateKeys() {
    setLoading(true);
    setErrors({});

    // TODO: Implement actual API key validation
    // For now, just check if keys are not empty
    const newErrors: typeof errors = {};

    if (!openrouterKey.trim()) {
      newErrors.openrouter = "OpenRouter Key ist erforderlich";
    }

    if (!heygenKey.trim()) {
      newErrors.heygen = "HeyGen Key ist erforderlich";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    // TODO: Save keys to Supabase
    // For now, just redirect to wizard
    router.push("/wizard/step-1");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white flex items-center justify-center p-4">
      <Card className="w-full max-w-lg bg-zinc-800/50 border-zinc-700">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            Willkommen bei ChannelMagic!
          </CardTitle>
          <CardDescription className="text-zinc-400">
            Bevor wir starten, brauchen wir ein paar Zugangsdaten. Das dauert nur 2 Minuten!
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* OpenRouter Key */}
          <div className="space-y-2">
            <Label htmlFor="openrouter" className="text-zinc-200">
              OpenRouter API Key
            </Label>
            <Input
              id="openrouter"
              type="password"
              placeholder="sk-or-v1-xxxxx..."
              value={openrouterKey}
              onChange={(e) => setOpenrouterKey(e.target.value)}
              className="bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-500"
            />
            {errors.openrouter && (
              <p className="text-red-400 text-sm">{errors.openrouter}</p>
            )}
            <a
              href="https://openrouter.ai/keys"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-purple-400 hover:text-purple-300"
            >
              Wo bekomme ich den?
            </a>
          </div>

          {/* HeyGen Key */}
          <div className="space-y-2">
            <Label htmlFor="heygen" className="text-zinc-200">
              HeyGen API Key
            </Label>
            <Input
              id="heygen"
              type="password"
              placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
              value={heygenKey}
              onChange={(e) => setHeygenKey(e.target.value)}
              className="bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-500"
            />
            {errors.heygen && (
              <p className="text-red-400 text-sm">{errors.heygen}</p>
            )}
            <a
              href="https://app.heygen.com/settings"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-purple-400 hover:text-purple-300"
            >
              Wo bekomme ich den?
            </a>
          </div>

          {/* Info Box */}
          <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-700">
            <p className="text-sm text-zinc-400">
              Diese Keys werden sicher gespeichert und nur verwendet um:
            </p>
            <ul className="text-sm text-zinc-400 mt-2 space-y-1">
              <li>- Skripte mit KI zu generieren (OpenRouter)</li>
              <li>- Avatar-Videos zu erstellen (HeyGen)</li>
            </ul>
          </div>

          {/* Submit Button */}
          <Button
            onClick={validateKeys}
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            {loading ? "Prüfe Keys..." : "Los geht's!"}
          </Button>

          {/* Magic Assistant */}
          <div className="flex items-start gap-3 pt-4 border-t border-zinc-700">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-sm shrink-0">
              🤖
            </div>
            <p className="text-sm text-zinc-400">
              &quot;Keine Sorge, ich erkläre dir alles! Klick auf die Links um die Keys zu bekommen.
              Bei Fragen bin ich hier.&quot;
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
