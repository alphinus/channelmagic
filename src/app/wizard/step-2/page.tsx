"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const POPULAR_TOPICS = [
  { icon: "🏋️", label: "Fitness" },
  { icon: "💰", label: "Finanzen" },
  { icon: "🎮", label: "Gaming" },
  { icon: "🍳", label: "Kochen" },
  { icon: "📱", label: "Tech" },
  { icon: "✨", label: "Lifestyle" },
  { icon: "📚", label: "Bildung" },
  { icon: "🎵", label: "Musik" },
];

export default function WizardStep2() {
  const router = useRouter();
  const [topic, setTopic] = useState("");
  const [selectedChip, setSelectedChip] = useState<string | null>(null);

  function selectTopic(label: string) {
    setSelectedChip(label);
    setTopic(label);
  }

  function handleNext() {
    if (topic.trim()) {
      // TODO: Save to state/Supabase
      router.push("/wizard/step-3");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white flex flex-col">
      {/* Progress */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-2 text-sm text-zinc-400">
          <span className="text-purple-400 font-semibold">Schritt 2</span>
          <span>/</span>
          <span>6</span>
        </div>
        <div className="h-1 bg-zinc-800 rounded-full mt-2">
          <div className="h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full w-[33%]" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <h1 className="text-3xl font-bold mb-4">Dein Thema</h1>
          <p className="text-zinc-400 mb-8">
            Worüber möchtest du Videos machen?
          </p>

          <div className="space-y-6">
            {/* Custom Input */}
            <div className="text-left">
              <Label htmlFor="topic" className="text-zinc-200">
                Beschreibe dein Thema
              </Label>
              <Input
                id="topic"
                placeholder="z.B. Kochen für Anfänger, Fitness für Zuhause..."
                value={topic}
                onChange={(e) => {
                  setTopic(e.target.value);
                  setSelectedChip(null);
                }}
                className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 mt-2"
              />
            </div>

            {/* Or Divider */}
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-zinc-700" />
              <span className="text-zinc-500 text-sm">oder wähle</span>
              <div className="flex-1 h-px bg-zinc-700" />
            </div>

            {/* Topic Chips */}
            <div className="flex flex-wrap gap-2 justify-center">
              {POPULAR_TOPICS.map((t) => (
                <button
                  key={t.label}
                  onClick={() => selectTopic(t.label)}
                  className={`px-4 py-2 rounded-full border transition-colors ${
                    selectedChip === t.label
                      ? "bg-purple-600 border-purple-500 text-white"
                      : "bg-zinc-800 border-zinc-700 text-zinc-300 hover:border-purple-500"
                  }`}
                >
                  {t.icon} {t.label}
                </button>
              ))}
            </div>

            <Button
              onClick={handleNext}
              disabled={!topic.trim()}
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
              &quot;Wähle etwas, worüber du gerne redest! Ich analysiere dann dein Thema
              und finde die besten Keywords und Trends dafür.&quot;
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
