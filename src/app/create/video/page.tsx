"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppStore } from "@/store/app-store";
import { useProjectStore } from "@/store/project-store";
import { useTranslation } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  ArrowRight,
  Loader2,
  Video,
  Download,
  Play,
  Mic,
  Film,
  Subtitles,
  ExternalLink
} from "lucide-react";
import Link from "next/link";

function VideoPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useTranslation();
  const { mode, apiKeys } = useAppStore();
  const { currentProject, diyChecklist, setDiyChecklistItem } = useProjectStore();

  const [isGenerating, setIsGenerating] = useState(false);
  const [videoId, setVideoId] = useState<string | null>(null);
  const [videoStatus, setVideoStatus] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);

  const script = currentProject?.script?.fullText || searchParams.get("script") || "";

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [pollingInterval]);

  const handleGenerateVideo = async () => {
    if (!script) {
      setError("Kein Script vorhanden");
      return;
    }

    setIsGenerating(true);
    setError("");

    try {
      const response = await fetch("/api/generate/video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apiKey: apiKeys.heygen,
          script,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Fehler bei der Video-Generierung");
      }

      const data = await response.json();
      setVideoId(data.videoId);
      setVideoStatus("pending");

      // Start polling for video status
      startPolling(data.videoId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ein Fehler ist aufgetreten");
      setIsGenerating(false);
    }
  };

  const startPolling = (vId: string) => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(
          `/api/video/status?apiKey=${apiKeys.heygen}&videoId=${vId}`
        );

        if (!response.ok) {
          throw new Error("Fehler beim Abrufen des Video-Status");
        }

        const data = await response.json();
        setVideoStatus(data.status.status);

        if (data.status.status === "completed") {
          setVideoUrl(data.status.video_url);
          setIsGenerating(false);
          clearInterval(interval);
          setPollingInterval(null);
        } else if (data.status.status === "failed") {
          setError("Video-Generierung fehlgeschlagen");
          setIsGenerating(false);
          clearInterval(interval);
          setPollingInterval(null);
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    }, 5000); // Poll every 5 seconds

    setPollingInterval(interval);
  };

  const handleDownload = () => {
    if (videoUrl) {
      window.open(videoUrl, "_blank");
    }
  };

  const handleNext = () => {
    router.push("/create/thumbnail");
  };

  const canProceed = mode === "auto"
    ? videoUrl !== null
    : diyChecklist.voiceoverDone && diyChecklist.videoDone;

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <Link href="/create/script">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            {t("common.back")}
          </Button>
        </Link>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-3">Video erstellen</h1>
          <p className="text-zinc-400">
            Thema: <span className="text-purple-400 font-semibold">{currentProject?.topic || "Dein Video"}</span>
          </p>
        </div>

        {/* AUTO MODE */}
        {mode === "auto" && (
          <div className="space-y-6">
            {/* Script Display */}
            <Card className="bg-zinc-800/50 border-zinc-700 p-6">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Film className="w-5 h-5 text-purple-400" />
                Dein Script
              </h3>
              <div className="bg-zinc-900 rounded-lg p-4 max-h-[200px] overflow-y-auto">
                <p className="text-sm text-zinc-300 whitespace-pre-wrap">{script}</p>
              </div>
            </Card>

            {/* Generate Video Section */}
            {!videoId && !isGenerating && (
              <Card className="bg-zinc-800/50 border-zinc-700 p-6">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shrink-0">
                    <Video className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold mb-2">Video generieren</h2>
                    <p className="text-zinc-400 text-sm">
                      Erstelle automatisch ein Video mit KI-Avatar basierend auf deinem Script
                    </p>
                  </div>
                </div>

                {error && (
                  <div className="mb-4 bg-red-900/20 border border-red-900/50 rounded-lg p-4 text-red-400">
                    {error}
                  </div>
                )}

                <Button
                  onClick={handleGenerateVideo}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 py-6"
                >
                  <Video className="w-5 h-5 mr-2" />
                  Video jetzt generieren
                </Button>
              </Card>
            )}

            {/* Video Generation Progress */}
            {isGenerating && (
              <Card className="bg-zinc-800/50 border-zinc-700 p-6">
                <div className="text-center py-12">
                  <Loader2 className="w-12 h-12 text-purple-500 animate-spin mx-auto mb-4" />
                  <p className="text-lg font-semibold mb-2">Video wird generiert...</p>
                  <p className="text-zinc-400 text-sm">
                    Status: <span className="text-purple-400">{videoStatus || "Initialisierung"}</span>
                  </p>
                  <p className="text-zinc-500 text-xs mt-2">
                    Dies kann mehrere Minuten dauern. Die Seite aktualisiert sich automatisch.
                  </p>
                </div>
              </Card>
            )}

            {/* Video Ready */}
            {videoUrl && !isGenerating && (
              <Card className="bg-zinc-800/50 border-zinc-700 p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center shrink-0">
                    <Play className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-green-400">Video fertig!</h2>
                    <p className="text-zinc-400 text-sm">Dein Video wurde erfolgreich erstellt</p>
                  </div>
                </div>

                <div className="bg-zinc-900 rounded-lg p-4 mb-4">
                  <video
                    src={videoUrl}
                    controls
                    className="w-full rounded-lg"
                    poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23222' width='100' height='100'/%3E%3C/svg%3E"
                  />
                </div>

                <Button
                  onClick={handleDownload}
                  variant="outline"
                  className="w-full gap-2"
                >
                  <Download className="w-4 h-4" />
                  Video herunterladen
                </Button>
              </Card>
            )}
          </div>
        )}

        {/* DIY MODE */}
        {mode === "diy" && (
          <div className="space-y-6">
            {/* Script Reference */}
            <Card className="bg-zinc-800/30 border-zinc-700/50 p-6">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Film className="w-5 h-5 text-green-400" />
                Dein Script
              </h3>
              <div className="bg-zinc-900 rounded-lg p-4 max-h-[200px] overflow-y-auto">
                <p className="text-sm text-zinc-300 whitespace-pre-wrap">
                  {script || "Füge dein Script in der vorherigen Phase hinzu"}
                </p>
              </div>
            </Card>

            {/* Voiceover Instructions */}
            <Card className="bg-zinc-800/50 border-zinc-700 p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shrink-0">
                  <Mic className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-2">
                    Schritt 1: Voiceover aufnehmen
                  </h2>
                  <p className="text-zinc-400 text-sm">
                    Nutze eines dieser Tools, um dein Script als Sprache aufzunehmen
                  </p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between p-4 bg-zinc-900 rounded-lg">
                  <div>
                    <div className="font-medium">ElevenLabs</div>
                    <div className="text-xs text-zinc-500">
                      Hochqualitative KI-Stimmen - Empfohlen
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open("https://elevenlabs.io", "_blank")}
                  >
                    <ExternalLink className="w-4 h-4 mr-1" />
                    Öffnen
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 bg-zinc-900 rounded-lg">
                  <div>
                    <div className="font-medium">Natural Readers</div>
                    <div className="text-xs text-zinc-500">
                      Kostenlose Alternative
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open("https://www.naturalreaders.com", "_blank")}
                  >
                    <ExternalLink className="w-4 h-4 mr-1" />
                    Öffnen
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 bg-zinc-900 rounded-lg">
                  <div>
                    <div className="font-medium">Deine eigene Stimme</div>
                    <div className="text-xs text-zinc-500">
                      Nutze dein Mikrofon oder Handy
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-green-900/20 rounded-lg border border-green-900/50">
                <Checkbox
                  id="voiceover"
                  checked={diyChecklist.voiceoverDone}
                  onCheckedChange={(checked) =>
                    setDiyChecklistItem("voiceoverDone", checked === true)
                  }
                />
                <Label
                  htmlFor="voiceover"
                  className="text-sm font-normal cursor-pointer"
                >
                  Script aufgenommen/vorgelesen
                </Label>
              </div>
            </Card>

            {/* Video Editing Instructions */}
            <Card className="bg-zinc-800/50 border-zinc-700 p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shrink-0">
                  <Film className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-2">
                    Schritt 2: Video erstellen
                  </h2>
                  <p className="text-zinc-400 text-sm">
                    Erstelle dein Video mit einem dieser einfachen Tools
                  </p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between p-4 bg-zinc-900 rounded-lg">
                  <div>
                    <div className="font-medium">CapCut</div>
                    <div className="text-xs text-zinc-500">
                      Kostenloser Video-Editor - Sehr einfach
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open("https://www.capcut.com", "_blank")}
                  >
                    <ExternalLink className="w-4 h-4 mr-1" />
                    Öffnen
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 bg-zinc-900 rounded-lg">
                  <div>
                    <div className="font-medium">Canva Video</div>
                    <div className="text-xs text-zinc-500">
                      Templates und einfache Bearbeitung
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open("https://www.canva.com/video-editor", "_blank")}
                  >
                    <ExternalLink className="w-4 h-4 mr-1" />
                    Öffnen
                  </Button>
                </div>
              </div>

              <div className="bg-zinc-900 rounded-lg p-4 mb-4 text-sm text-zinc-400">
                <p className="font-semibold text-zinc-300 mb-2">Tipps für dein Video:</p>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Füge visuell ansprechende B-Roll-Clips hinzu</li>
                  <li>Nutze dynamische Übergänge</li>
                  <li>Behalte eine gute Pacing bei</li>
                  <li>Achte auf passende Hintergrundmusik (leise!)</li>
                </ul>
              </div>

              <div className="flex items-center gap-3 p-3 bg-green-900/20 rounded-lg border border-green-900/50">
                <Checkbox
                  id="video"
                  checked={diyChecklist.videoDone}
                  onCheckedChange={(checked) =>
                    setDiyChecklistItem("videoDone", checked === true)
                  }
                />
                <Label
                  htmlFor="video"
                  className="text-sm font-normal cursor-pointer"
                >
                  Video erstellt
                </Label>
              </div>
            </Card>

            {/* Subtitles Section */}
            <Card className="bg-zinc-800/30 border-zinc-700/50 p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center shrink-0">
                  <Subtitles className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Bonus: Untertitel hinzufügen</h3>
                  <p className="text-zinc-400 text-sm mb-3">
                    Untertitel erhöhen die Engagement-Rate deutlich. CapCut und Canva bieten automatische Untertitel-Generierung.
                  </p>
                  <p className="text-green-400 text-xs">
                    Tipp: CapCut hat eine Auto-Captions Funktion!
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8">
          <Link href="/create/script">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Zurück zum Script
            </Button>
          </Link>

          <Button
            onClick={handleNext}
            disabled={!canProceed}
            className={`gap-2 ${
              mode === "auto"
                ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            }`}
          >
            Weiter zu Thumbnail
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </main>
    </div>
  );
}

export default function VideoPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
      </div>
    }>
      <VideoPageContent />
    </Suspense>
  );
}
