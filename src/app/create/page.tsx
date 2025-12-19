"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/app-store";
import { useWizardStore } from "@/store/wizard-store";
import { useProjectStore } from "@/store/project-store";
import { useTranslation } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Wand2, Wrench, Sparkles } from "lucide-react";
import Link from "next/link";

export default function CreatePage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { mode } = useAppStore();
  const { channel, strategy, platforms: selectedPlatforms } = useWizardStore();
  const { createProject, saveToDatabase } = useProjectStore();
  const [topic, setTopic] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) return;

    setIsGenerating(true);

    try {
      // Create project in store
      createProject(topic.trim(), selectedPlatforms);

      // Save to database and wait for videoId
      const videoId = await saveToDatabase();

      if (!videoId) {
        console.error('Failed to save project to database');
        // Still proceed - localStorage will have the data
      }

      if (mode === "auto") {
        // Auto-Mode: Navigate to script page with topic as query param
        router.push(`/create/script?topic=${encodeURIComponent(topic)}`);
      } else {
        // DIY-Mode: Navigate to script page to show prompt
        router.push(`/create/script?topic=${encodeURIComponent(topic)}&diy=true`);
      }
    } catch (error) {
      console.error('Error creating project:', error);
      setIsGenerating(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && topic.trim()) {
      handleGenerate();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <Link href="/dashboard">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            {t("common.back")}
          </Button>
        </Link>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {t("create.title")}
          </h1>
          <p className="text-zinc-400 text-lg">
            {channel.name && (
              <>
                Für: <span className="text-purple-400 font-semibold">{channel.name}</span>
              </>
            )}
          </p>
        </div>

        {/* Topic Input Card */}
        <Card className="bg-zinc-800/50 border-zinc-700 p-8 mb-8">
          <div className="space-y-6">
            <div>
              <Label htmlFor="topic" className="text-lg mb-3 block">
                {t("create.topic.label")}
              </Label>
              <Input
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={t("create.topic.placeholder")}
                className="bg-zinc-900 border-zinc-700 text-lg py-6 px-4"
                autoFocus
              />
            </div>

            {/* Mode Indicator */}
            <div className="flex items-center gap-3 p-4 bg-zinc-900 rounded-lg border border-zinc-700">
              {mode === "auto" ? (
                <>
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <Wand2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm">
                      {t("wizard.step4.auto.title")}
                    </div>
                    <div className="text-xs text-zinc-400">
                      KI generiert Script automatisch
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                    <Wrench className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm flex items-center gap-2">
                      {t("wizard.step4.diy.title")}
                      <span className="px-2 py-0.5 rounded-full bg-green-500 text-white text-xs">
                        {t("common.free")}
                      </span>
                    </div>
                    <div className="text-xs text-zinc-400">
                      Erhalte optimierte Prompts zum Kopieren
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Generate Button */}
            <Button
              onClick={handleGenerate}
              disabled={!topic.trim() || isGenerating}
              className={`w-full py-6 text-lg ${
                mode === "auto"
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              }`}
            >
              {isGenerating ? (
                <>
                  <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                  {t("create.generating")}
                </>
              ) : mode === "auto" ? (
                <>
                  <Wand2 className="w-5 h-5 mr-2" />
                  {t("create.generate")}
                </>
              ) : (
                <>
                  <Wrench className="w-5 h-5 mr-2" />
                  Prompt generieren
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* Context Information */}
        {(channel.niche || strategy.style) && (
          <Card className="bg-zinc-800/30 border-zinc-700/50 p-6">
            <h3 className="text-sm font-semibold text-zinc-400 mb-3">
              Dein Kanal-Kontext:
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              {channel.niche && (
                <div>
                  <div className="text-zinc-500 text-xs mb-1">Nische</div>
                  <div className="text-zinc-300 font-medium">
                    {t(`niches.${channel.niche}`)}
                  </div>
                </div>
              )}
              {strategy.style && (
                <div>
                  <div className="text-zinc-500 text-xs mb-1">Stil</div>
                  <div className="text-zinc-300 font-medium">
                    {t(`wizard.step2.styles.${strategy.style}`)}
                  </div>
                </div>
              )}
              {strategy.frequency && (
                <div>
                  <div className="text-zinc-500 text-xs mb-1">Frequenz</div>
                  <div className="text-zinc-300 font-medium">
                    {t(`wizard.step2.frequencies.${strategy.frequency}`)}
                  </div>
                </div>
              )}
              {channel.targetAudience && (
                <div>
                  <div className="text-zinc-500 text-xs mb-1">Zielgruppe</div>
                  <div className="text-zinc-300 font-medium truncate">
                    {channel.targetAudience}
                  </div>
                </div>
              )}
            </div>
          </Card>
        )}
      </main>
    </div>
  );
}
