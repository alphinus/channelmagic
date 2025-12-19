"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppStore } from "@/store/app-store";
import { useWizardStore } from "@/store/wizard-store";
import { useTranslation } from "@/lib/i18n";
import { generateScriptPrompt } from "@/lib/templates/script-prompts";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Copy, Check, Wand2, Wrench, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";

function ScriptPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t, locale } = useTranslation();
  const { mode } = useAppStore();
  const { channel, strategy, platforms } = useWizardStore();

  const topic = searchParams.get("topic") || "";
  const isDIY = searchParams.get("diy") === "true";

  const [script, setScript] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [prompt, setPrompt] = useState("");

  // Generate prompt for DIY mode
  useEffect(() => {
    if (isDIY && topic) {
      const generatedPrompt = generateScriptPrompt({
        topic,
        style: strategy.style || "educational",
        duration: "short",
        platform: platforms[0] || "youtube",
        locale: locale as "de" | "en",
        niche: channel.niche || undefined,
        targetAudience: channel.targetAudience || undefined,
      });
      setPrompt(generatedPrompt);
    }
  }, [isDIY, topic, strategy.style, platforms, locale, channel.niche, channel.targetAudience]);

  // Auto-generate script in Auto mode
  useEffect(() => {
    if (mode === "auto" && topic && !isDIY && !script) {
      generateScript();
    }
  }, [mode, topic, isDIY]);

  const generateScript = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/generate/script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          style: strategy.style || "educational",
          duration: "short",
          platform: platforms[0] || "youtube",
          locale,
          niche: channel.niche,
          targetAudience: channel.targetAudience,
        }),
      });

      if (!response.ok) {
        throw new Error("Fehler beim Generieren des Scripts");
      }

      const data = await response.json();
      setScript(data.script);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ein Fehler ist aufgetreten");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleCopyScript = async () => {
    try {
      await navigator.clipboard.writeText(script);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleNext = () => {
    // TODO: Navigate to video creation page
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <Link href="/create">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            {t("common.back")}
          </Button>
        </Link>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-3">
            {isDIY || mode === "diy" ? "Dein Script-Prompt" : "Dein Video-Script"}
          </h1>
          <p className="text-zinc-400">
            Thema: <span className="text-purple-400 font-semibold">{topic}</span>
          </p>
        </div>

        {/* DIY Mode - Show Prompt */}
        {(isDIY || mode === "diy") && (
          <div className="space-y-6">
            <Card className="bg-zinc-800/50 border-zinc-700 p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shrink-0">
                  <Wrench className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-2">
                    {t("diy.workflow.prompt.title")}
                  </h2>
                  <p className="text-zinc-400 text-sm">
                    {t("diy.steps.script.description")}
                  </p>
                </div>
              </div>

              <div className="bg-zinc-900 rounded-lg p-4 mb-4 font-mono text-sm overflow-x-auto">
                <pre className="whitespace-pre-wrap text-zinc-300">{prompt}</pre>
              </div>

              <Button
                onClick={handleCopyPrompt}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    {t("diy.workflow.prompt.copied")}
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    {t("diy.workflow.prompt.copy")}
                  </>
                )}
              </Button>
            </Card>

            {/* DIY Tools Section */}
            <Card className="bg-zinc-800/30 border-zinc-700/50 p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <span className="text-green-400">Schritt 1:</span>
                {t("diy.steps.script.title")}
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-zinc-900 rounded-lg">
                  <div>
                    <div className="font-medium">ChatGPT</div>
                    <div className="text-xs text-zinc-500">
                      chat.openai.com - {t("diy.workflow.tools.free")}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open("https://chat.openai.com", "_blank")}
                  >
                    Öffnen
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 bg-zinc-900 rounded-lg">
                  <div>
                    <div className="font-medium">Claude</div>
                    <div className="text-xs text-zinc-500">
                      claude.ai - {t("diy.workflow.tools.free")}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open("https://claude.ai", "_blank")}
                  >
                    Öffnen
                  </Button>
                </div>
              </div>
            </Card>

            {/* Manual Script Input */}
            <Card className="bg-zinc-800/50 border-zinc-700 p-6">
              <h3 className="font-semibold mb-4">
                Script einfügen (optional)
              </h3>
              <Textarea
                value={script}
                onChange={(e) => setScript(e.target.value)}
                placeholder="Füge hier dein generiertes Script ein..."
                className="bg-zinc-900 border-zinc-700 min-h-[300px] font-mono text-sm"
              />
            </Card>
          </div>
        )}

        {/* Auto Mode - Show Generated Script */}
        {mode === "auto" && !isDIY && (
          <Card className="bg-zinc-800/50 border-zinc-700 p-6">
            {isLoading && (
              <div className="text-center py-12">
                <Loader2 className="w-12 h-12 text-purple-500 animate-spin mx-auto mb-4" />
                <p className="text-zinc-400">Generiere dein Script...</p>
                <p className="text-zinc-500 text-sm mt-2">
                  Dies kann bis zu 30 Sekunden dauern
                </p>
              </div>
            )}

            {error && (
              <div className="bg-red-900/20 border border-red-900/50 rounded-lg p-6 text-center">
                <p className="text-red-400 mb-4">{error}</p>
                <Button
                  onClick={generateScript}
                  variant="outline"
                  className="border-red-500 text-red-400 hover:bg-red-500/10"
                >
                  Erneut versuchen
                </Button>
              </div>
            )}

            {script && !isLoading && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <Wand2 className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-xl font-bold">Generiertes Script</h2>
                  </div>
                  <Button
                    onClick={handleCopyScript}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4" />
                        {t("common.copied")}
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        {t("common.copy")}
                      </>
                    )}
                  </Button>
                </div>

                <Textarea
                  value={script}
                  onChange={(e) => setScript(e.target.value)}
                  className="bg-zinc-900 border-zinc-700 min-h-[400px] font-mono text-sm mb-4"
                />

                <div className="flex items-center gap-3 p-3 bg-purple-900/20 rounded-lg border border-purple-900/50">
                  <div className="text-sm text-purple-300">
                    Tipp: Du kannst das Script nach Belieben bearbeiten, bevor du weitermachst.
                  </div>
                </div>
              </>
            )}
          </Card>
        )}

        {/* Navigation */}
        {(script || (isDIY && prompt)) && (
          <div className="flex justify-end gap-4 mt-8">
            <Button
              onClick={handleNext}
              disabled={!script && isDIY}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 gap-2"
            >
              {isDIY ? "Weiter zu Schritt 2" : "Video erstellen"}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}

export default function ScriptPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
      </div>
    }>
      <ScriptPageContent />
    </Suspense>
  );
}
