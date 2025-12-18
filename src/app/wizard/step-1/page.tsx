"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function WizardStep1() {
  const router = useRouter();
  const [name, setName] = useState("");

  function handleNext() {
    if (name.trim()) {
      // TODO: Save to state/Supabase
      router.push("/wizard/step-2");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white flex flex-col">
      {/* Progress */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-2 text-sm text-zinc-400">
          <span className="text-purple-400 font-semibold">Schritt 1</span>
          <span>/</span>
          <span>6</span>
        </div>
        <div className="h-1 bg-zinc-800 rounded-full mt-2">
          <div className="h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full w-[16%]" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <h1 className="text-3xl font-bold mb-4">Willkommen!</h1>
          <p className="text-zinc-400 mb-8">
            Ich helfe dir, deinen eigenen YouTube & TikTok Kanal zu starten.
            Wie heißt du?
          </p>

          <div className="space-y-4">
            <div className="text-left">
              <Label htmlFor="name" className="text-zinc-200">
                Dein Name
              </Label>
              <Input
                id="name"
                placeholder="Max Mustermann"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 mt-2"
                autoFocus
              />
            </div>

            <Button
              onClick={handleNext}
              disabled={!name.trim()}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              Weiter
            </Button>
          </div>
        </div>
      </div>

      {/* Magic Assistant */}
      <div className="container mx-auto px-4 py-6 border-t border-zinc-800">
        <div className="flex items-start gap-3 max-w-2xl mx-auto">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-lg shrink-0">
            🤖
          </div>
          <div className="bg-zinc-800/50 rounded-lg p-4 flex-1">
            <p className="text-zinc-300">
              &quot;Hey! Ich bin Magic, dein Assistent. In den nächsten 6 Schritten
              erstellen wir gemeinsam deinen Kanal. Du musst nur ein paar Fragen
              beantworten - den Rest mache ich!&quot;
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
