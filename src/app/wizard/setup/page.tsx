"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/app-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToolCard } from "@/components/diy/ToolCard";
import { diyTools } from "@/lib/diy/tools";
import { ArrowLeft, ExternalLink, Key } from "lucide-react";

function AutoSetup() {
  const { apiKeys, setApiKey } = useAppStore();
  const [openrouterKey, setOpenrouterKey] = useState(apiKeys.openrouter || "");
  const [heygenKey, setHeygenKey] = useState(apiKeys.heygen || "");

  const handleSaveKeys = () => {
    setApiKey("openrouter", openrouterKey);
    setApiKey("heygen", heygenKey);
  };

  const isValid = openrouterKey.trim() !== "" && heygenKey.trim() !== "";

  return (
    <div className="space-y-6">
      <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Key className="w-5 h-5 text-purple-400 mt-0.5" />
          <div>
            <h3 className="font-semibold text-purple-300 mb-1">
              API-Schlüssel benötigt
            </h3>
            <p className="text-sm text-zinc-400">
              Im Auto-Modus verwenden wir OpenRouter für Skripte und HeyGen für
              Avatar-Videos. Du brauchst API-Keys für beide Services.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {/* OpenRouter API Key */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label htmlFor="openrouter-key" className="text-zinc-200">
              OpenRouter API-Schlüssel
            </Label>
            <a
              href="https://openrouter.ai/keys"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1"
            >
              API-Key erstellen <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <Input
            id="openrouter-key"
            type="password"
            placeholder="sk-or-v1-..."
            value={openrouterKey}
            onChange={(e) => setOpenrouterKey(e.target.value)}
            className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 font-mono text-sm"
          />
          <p className="text-xs text-zinc-500 mt-1">
            Für KI-gestützte Skripterstellung und Content-Generierung
          </p>
        </div>

        {/* HeyGen API Key */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label htmlFor="heygen-key" className="text-zinc-200">
              HeyGen API-Schlüssel
            </Label>
            <a
              href="https://app.heygen.com/settings/api"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1"
            >
              API-Key erstellen <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <Input
            id="heygen-key"
            type="password"
            placeholder="..."
            value={heygenKey}
            onChange={(e) => setHeygenKey(e.target.value)}
            className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 font-mono text-sm"
          />
          <p className="text-xs text-zinc-500 mt-1">
            Für KI-Avatar-Videos und Sprachgenerierung
          </p>
        </div>

        <Button
          onClick={handleSaveKeys}
          disabled={!isValid}
          variant="outline"
          className="w-full border-zinc-700 hover:border-purple-500 hover:bg-purple-500/10"
        >
          Schlüssel speichern
        </Button>

        {isValid && (
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
            <p className="text-sm text-green-400">
              API-Schlüssel wurden gespeichert. Du kannst jetzt fortfahren.
            </p>
          </div>
        )}
      </div>

      <div className="bg-zinc-800/30 border border-zinc-700 rounded-lg p-4">
        <h4 className="font-medium text-zinc-300 mb-2">Kosten</h4>
        <ul className="text-sm text-zinc-400 space-y-1">
          <li>• OpenRouter: Pay-per-use, ab ~$0.001 pro Video-Skript</li>
          <li>• HeyGen: Ab $24/Monat oder Pay-per-use Credits</li>
          <li>• Geschätzte Kosten: $0.50 - $2.00 pro fertigem Video</li>
        </ul>
      </div>
    </div>
  );
}

function DiyOverview() {
  const categories = [
    {
      key: "script" as const,
      title: "Skripte & Ideen",
      description: "KI-Tools für Content-Ideen und Skripterstellung",
      icon: "📝",
    },
    {
      key: "video" as const,
      title: "Video-Editing",
      description: "Schneide und bearbeite deine Videos",
      icon: "🎬",
    },
    {
      key: "thumbnail" as const,
      title: "Thumbnails",
      description: "Erstelle auffällige Video-Thumbnails",
      icon: "🎨",
    },
    {
      key: "voiceover" as const,
      title: "Voiceover",
      description: "Text-zu-Sprache für deine Videos",
      icon: "🎙️",
    },
    {
      key: "avatar" as const,
      title: "KI-Avatare",
      description: "Erstelle Videos mit KI-Avataren",
      icon: "👤",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl">🛠️</span>
          <div>
            <h3 className="font-semibold text-blue-300 mb-1">
              Empfohlene DIY-Tools
            </h3>
            <p className="text-sm text-zinc-400">
              Wir haben die besten kostenlosen und günstigen Tools für dich
              zusammengestellt. Du kannst alle einzeln verwenden und so deinen
              eigenen Workflow erstellen.
            </p>
          </div>
        </div>
      </div>

      {categories.map((category) => {
        const tools = diyTools[category.key].slice(0, 3); // Top 3 tools per category
        return (
          <div key={category.key} className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{category.icon}</span>
              <div>
                <h3 className="font-semibold text-white">{category.title}</h3>
                <p className="text-sm text-zinc-400">{category.description}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {tools.map((tool) => (
                <ToolCard key={tool.name} tool={tool} />
              ))}
            </div>
          </div>
        );
      })}

      <div className="bg-zinc-800/30 border border-zinc-700 rounded-lg p-4">
        <h4 className="font-medium text-zinc-300 mb-2">Workflow-Tipp</h4>
        <ol className="text-sm text-zinc-400 space-y-1 list-decimal list-inside">
          <li>Verwende ChatGPT oder Claude für Skript-Ideen</li>
          <li>Nimm dein Video auf oder erstelle es mit CapCut</li>
          <li>Erstelle ein Thumbnail mit Canva</li>
          <li>Lade es auf deine Plattformen hoch</li>
        </ol>
      </div>
    </div>
  );
}

export default function WizardSetup() {
  const router = useRouter();
  const { mode } = useAppStore();
  const { apiKeys } = useAppStore();

  const handleBack = () => {
    router.push("/wizard/mode-selection");
  };

  const handleNext = () => {
    router.push("/wizard/ready");
  };

  // Check if can proceed based on mode
  const canProceed = mode === "diy" || (mode === "auto" && apiKeys.openrouter && apiKeys.heygen);

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white flex flex-col">
      {/* Progress */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-2 text-sm text-zinc-400">
          <span className="text-purple-400 font-semibold">Schritt 5</span>
          <span>/</span>
          <span>6</span>
        </div>
        <div className="h-1 bg-zinc-800 rounded-full mt-2">
          <div className="h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full w-[83%]" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-3xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">
              {mode === "auto" ? "API-Schlüssel einrichten" : "Deine DIY-Tools"}
            </h1>
            <p className="text-zinc-400">
              {mode === "auto"
                ? "Verbinde deine API-Keys für vollautomatische Video-Erstellung"
                : "Hier sind die besten kostenlosen Tools für deinen Content"}
            </p>
          </div>

          {mode === "auto" ? <AutoSetup /> : <DiyOverview />}

          <div className="flex gap-3 mt-8">
            <Button
              onClick={handleBack}
              variant="outline"
              className="border-zinc-700 hover:border-zinc-600"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Zurück
            </Button>
            <Button
              onClick={handleNext}
              disabled={!canProceed}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
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
              {mode === "auto"
                ? '"Deine API-Keys werden sicher gespeichert. Ich verwende sie nur, um Videos für dich zu erstellen. Du kannst sie jederzeit ändern oder entfernen."'
                : '"Diese Tools sind meine persönlichen Empfehlungen! Viele Creator nutzen genau diese Kombination. Du kannst aber auch andere Tools verwenden - das Wichtigste ist, dass du loslegst!"'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
