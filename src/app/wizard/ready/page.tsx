"use client";

import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/app-store";
import { useWizardStore } from "@/store/wizard-store";
import { Button } from "@/components/ui/button";
import { platforms } from "@/lib/platforms/config";
import { CheckCircle2, Sparkles, LayoutDashboard } from "lucide-react";

export default function WizardReady() {
  const router = useRouter();
  const { mode } = useAppStore();
  const { channel, strategy, platforms: selectedPlatforms } = useWizardStore();

  const handleCreateVideo = () => {
    router.push("/create");
  };

  const handleDashboard = () => {
    router.push("/dashboard");
  };

  const modeLabel = mode === "auto" ? "Automatisch" : "DIY";
  const modeIcon = mode === "auto" ? "🤖" : "🛠️";

  const frequencyLabels = {
    daily: "Täglich",
    "2-3x-week": "2-3x pro Woche",
    weekly: "Wöchentlich",
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white flex flex-col">
      {/* Progress */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-2 text-sm text-zinc-400">
          <span className="text-purple-400 font-semibold">Schritt 6</span>
          <span>/</span>
          <span>6</span>
        </div>
        <div className="h-1 bg-zinc-800 rounded-full mt-2">
          <div className="h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full w-[100%]" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 mb-4">
              <CheckCircle2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Alles bereit!</h1>
            <p className="text-zinc-400 text-lg">
              Dein Kanal ist konfiguriert. Lass uns dein erstes Video erstellen!
            </p>
          </div>

          {/* Summary */}
          <div className="space-y-4 mb-8">
            {/* Channel Info */}
            <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-5">
              <h3 className="text-sm font-medium text-zinc-400 mb-3">
                Dein Kanal
              </h3>
              <div className="space-y-2">
                <div>
                  <span className="text-2xl font-bold text-white">
                    {channel.name}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-zinc-300">
                  <span className="text-purple-400">•</span>
                  <span>
                    {channel.niche === "other" && channel.customNiche
                      ? channel.customNiche
                      : channel.niche}
                  </span>
                </div>
              </div>
            </div>

            {/* Platforms */}
            <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-5">
              <h3 className="text-sm font-medium text-zinc-400 mb-3">
                Plattformen
              </h3>
              <div className="flex gap-3">
                {selectedPlatforms.map((platform) => {
                  const config = platforms[platform];
                  return (
                    <div
                      key={platform}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-700/50 border border-zinc-600"
                    >
                      <span className="text-xl">{config.icon}</span>
                      <span className="font-medium text-white">
                        {config.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Mode & Strategy */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-5">
                <h3 className="text-sm font-medium text-zinc-400 mb-3">
                  Modus
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{modeIcon}</span>
                  <span className="font-medium text-white">{modeLabel}</span>
                </div>
              </div>

              <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-5">
                <h3 className="text-sm font-medium text-zinc-400 mb-3">
                  Upload-Frequenz
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">📅</span>
                  <span className="font-medium text-white">
                    {strategy.frequency
                      ? frequencyLabels[strategy.frequency]
                      : "Nicht festgelegt"}
                  </span>
                </div>
              </div>
            </div>

            {/* Content Style */}
            {strategy.style && (
              <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-5">
                <h3 className="text-sm font-medium text-zinc-400 mb-3">
                  Content-Stil
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">
                    {strategy.style === "educational" && "📚"}
                    {strategy.style === "entertaining" && "🎭"}
                    {strategy.style === "inspirational" && "✨"}
                  </span>
                  <span className="font-medium text-white capitalize">
                    {strategy.style === "educational" && "Bildend"}
                    {strategy.style === "entertaining" && "Unterhaltend"}
                    {strategy.style === "inspirational" && "Inspirierend"}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* CTAs */}
          <div className="space-y-3">
            <Button
              onClick={handleCreateVideo}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg py-6"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Erstes Video erstellen
            </Button>

            <Button
              onClick={handleDashboard}
              variant="outline"
              className="w-full border-zinc-700 hover:border-zinc-600 py-6"
            >
              <LayoutDashboard className="w-5 h-5 mr-2" />
              Zum Dashboard
            </Button>
          </div>

          {/* Optional: Account hint */}
          <div className="mt-6 text-center">
            <p className="text-sm text-zinc-500">
              Tipp: Erstelle einen Account, um deine Einstellungen und Videos
              zu speichern
            </p>
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
                ? '"Perfekt! Ich habe alles, was ich brauche. Lass uns dein erstes Video erstellen - ich übernehme Skript, Avatar und alles andere automatisch!"'
                : '"Super! Du hast jetzt eine Übersicht aller Tools. Im Dashboard findest du Vorlagen und Schritt-für-Schritt Anleitungen für deine ersten Videos!"'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
