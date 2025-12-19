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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  ArrowRight,
  Loader2,
  Image as ImageIcon,
  Copy,
  Check,
  Lightbulb,
  Upload,
  ExternalLink,
  Sparkles,
  Type
} from "lucide-react";
import Link from "next/link";

function ThumbnailPageContent() {
  const router = useRouter();
  const { t } = useTranslation();
  const { mode } = useAppStore();
  const { currentProject, diyChecklist, setDiyChecklistItem } = useProjectStore();

  const [thumbnailPrompt, setThumbnailPrompt] = useState("");
  const [customPrompt, setCustomPrompt] = useState("");
  const [copied, setCopied] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  const topic = currentProject?.topic || "Dein Video";
  const script = currentProject?.script?.fullText || "";

  // Generate thumbnail prompt based on topic and script
  useEffect(() => {
    if (topic) {
      const hook = currentProject?.script?.hook || "";
      const mainIdea = hook || script.split('\n')[0] || topic;

      const prompt = `Create a vibrant, eye-catching YouTube thumbnail for a video about "${topic}".

Style: Modern, high-energy, professional
Colors: Bold and contrasting colors that pop
Text: "${mainIdea}" in large, bold, easy-to-read font
Elements:
- Main subject/concept clearly visible
- Emotional appeal (curiosity, excitement, or value)
- Clean composition with clear focal point
- Professional lighting and shadows

The thumbnail should immediately grab attention and make viewers want to click.`;

      setThumbnailPrompt(prompt);
      setCustomPrompt(prompt);
    }
  }, [topic, script, currentProject]);

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(customPrompt || thumbnailPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setThumbnailPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNext = () => {
    // TODO: Navigate to review page
    router.push("/dashboard");
  };

  const canProceed = mode === "auto"
    ? uploadedFile !== null
    : diyChecklist.thumbnailDone;

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <Link href="/create/video">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            {t("common.back")}
          </Button>
        </Link>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-3">Thumbnail erstellen</h1>
          <p className="text-zinc-400">
            Thema: <span className="text-purple-400 font-semibold">{topic}</span>
          </p>
        </div>

        {/* AUTO MODE */}
        {mode === "auto" && (
          <div className="space-y-6">
            {/* Generated Prompt Section */}
            <Card className="bg-zinc-800/50 border-zinc-700 p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shrink-0">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-2">KI-Thumbnail Prompt</h2>
                  <p className="text-zinc-400 text-sm">
                    Nutze diesen optimierten Prompt für Bildgeneratoren
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <Label htmlFor="prompt" className="text-sm mb-2 block">
                  Thumbnail-Beschreibung (anpassbar)
                </Label>
                <Textarea
                  id="prompt"
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  className="bg-zinc-900 border-zinc-700 min-h-[200px] font-mono text-sm"
                />
              </div>

              <Button
                onClick={handleCopyPrompt}
                className="w-full bg-purple-600 hover:bg-purple-700 mb-4"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Kopiert!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Prompt kopieren
                  </>
                )}
              </Button>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Button
                  variant="outline"
                  onClick={() => window.open("https://www.canva.com/ai-image-generator", "_blank")}
                  className="gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Canva AI
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.open("https://labs.openai.com", "_blank")}
                  className="gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  DALL-E
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.open("https://www.midjourney.com", "_blank")}
                  className="gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Midjourney
                </Button>
              </div>
            </Card>

            {/* Upload Section */}
            <Card className="bg-zinc-800/50 border-zinc-700 p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Upload className="w-5 h-5 text-purple-400" />
                Fertiges Thumbnail hochladen
              </h3>

              {thumbnailPreview ? (
                <div className="space-y-4">
                  <div className="relative rounded-lg overflow-hidden bg-zinc-900 border border-zinc-700">
                    <img
                      src={thumbnailPreview}
                      alt="Thumbnail Preview"
                      className="w-full h-auto"
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        setUploadedFile(null);
                        setThumbnailPreview(null);
                      }}
                    >
                      Anderes Bild wählen
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-zinc-700 rounded-lg p-8 text-center hover:border-purple-500 transition-colors">
                  <Input
                    id="thumbnail-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Label
                    htmlFor="thumbnail-upload"
                    className="cursor-pointer flex flex-col items-center gap-3"
                  >
                    <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-zinc-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-1">
                        Klicke zum Hochladen
                      </p>
                      <p className="text-xs text-zinc-500">
                        PNG, JPG bis zu 10MB
                      </p>
                    </div>
                  </Label>
                </div>
              )}
            </Card>
          </div>
        )}

        {/* DIY MODE */}
        {mode === "diy" && (
          <div className="space-y-6">
            {/* Design Tips */}
            <Card className="bg-zinc-800/50 border-zinc-700 p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shrink-0">
                  <Lightbulb className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-2">
                    Thumbnail Design-Tipps
                  </h2>
                  <p className="text-zinc-400 text-sm">
                    Erstelle ein Thumbnail, das Aufmerksamkeit erregt
                  </p>
                </div>
              </div>

              <div className="bg-zinc-900 rounded-lg p-4 space-y-4">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Type className="w-4 h-4 text-green-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Große, lesbare Schrift</h4>
                    <p className="text-zinc-400 text-xs">
                      Verwende 3-5 Wörter in großer, fetter Schrift. Muss auch auf Handy lesbar sein.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <ImageIcon className="w-4 h-4 text-green-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Kontrastreiche Farben</h4>
                    <p className="text-zinc-400 text-xs">
                      Nutze komplementäre Farben (z.B. Blau/Orange, Rot/Grün) für maximalen Kontrast.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-4 h-4 text-green-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Emotionale Ausdrücke</h4>
                    <p className="text-zinc-400 text-xs">
                      Gesichter mit starken Emotionen (Überraschung, Freude) erhöhen die Klickrate.
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Tools & Generators */}
            <Card className="bg-zinc-800/50 border-zinc-700 p-6">
              <h3 className="font-semibold mb-4">Empfohlene Tools</h3>

              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between p-4 bg-zinc-900 rounded-lg">
                  <div>
                    <div className="font-medium">Canva</div>
                    <div className="text-xs text-zinc-500">
                      Templates + einfache Bearbeitung - Kostenlos
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open("https://www.canva.com/create/thumbnails", "_blank")}
                  >
                    <ExternalLink className="w-4 h-4 mr-1" />
                    Öffnen
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 bg-zinc-900 rounded-lg">
                  <div>
                    <div className="font-medium">Photopea</div>
                    <div className="text-xs text-zinc-500">
                      Kostenlose Photoshop-Alternative im Browser
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open("https://www.photopea.com", "_blank")}
                  >
                    <ExternalLink className="w-4 h-4 mr-1" />
                    Öffnen
                  </Button>
                </div>
              </div>

              <div className="border-t border-zinc-700 pt-4">
                <h4 className="text-sm font-semibold mb-3 text-green-400">
                  KI-Bildgeneratoren
                </h4>
                <p className="text-xs text-zinc-400 mb-3">
                  Nutze diese Prompts mit KI-Tools:
                </p>
                <div className="bg-zinc-900 rounded-lg p-3 mb-3">
                  <Textarea
                    value={customPrompt || thumbnailPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    className="bg-zinc-800 border-zinc-700 min-h-[120px] text-xs font-mono"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleCopyPrompt}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 flex-1"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3 h-3 mr-1" />
                        Kopiert!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 mr-1" />
                        Kopieren
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open("https://www.canva.com/ai-image-generator", "_blank")}
                  >
                    Zu Canva AI
                  </Button>
                </div>
              </div>
            </Card>

            {/* Example Prompts */}
            <Card className="bg-zinc-800/30 border-zinc-700/50 p-6">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-green-400" />
                Beispiel-Prompts für dein Thema
              </h3>
              <div className="space-y-3 text-sm">
                <div className="bg-zinc-900 rounded-lg p-3">
                  <p className="text-zinc-400">
                    "Bold, eye-catching YouTube thumbnail: '{topic}' in large text, vibrant colors, shocked expression, professional"
                  </p>
                </div>
                <div className="bg-zinc-900 rounded-lg p-3">
                  <p className="text-zinc-400">
                    "Modern YouTube thumbnail design about '{topic}', minimal style, bold typography, high contrast colors"
                  </p>
                </div>
              </div>
            </Card>

            {/* Checklist */}
            <Card className="bg-zinc-800/50 border-zinc-700 p-6">
              <h3 className="font-semibold mb-4">Deine Checkliste</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-zinc-900 rounded-lg">
                  <Checkbox
                    id="thumbnail-created"
                    checked={diyChecklist.thumbnailDone}
                    onCheckedChange={(checked) =>
                      setDiyChecklistItem("thumbnailDone", checked === true)
                    }
                  />
                  <Label
                    htmlFor="thumbnail-created"
                    className="text-sm font-normal cursor-pointer"
                  >
                    Thumbnail erstellt
                  </Label>
                </div>
                <div className="flex items-center gap-3 p-3 bg-zinc-900 rounded-lg opacity-50">
                  <Checkbox id="text-readable" disabled />
                  <Label
                    htmlFor="text-readable"
                    className="text-sm font-normal"
                  >
                    Titel auf Thumbnail lesbar (auch auf Handy)
                  </Label>
                </div>
                <div className="flex items-center gap-3 p-3 bg-zinc-900 rounded-lg opacity-50">
                  <Checkbox id="colors-pop" disabled />
                  <Label
                    htmlFor="colors-pop"
                    className="text-sm font-normal"
                  >
                    Farben stechen hervor und kontrastieren gut
                  </Label>
                </div>
              </div>

              <div className="mt-4 p-3 bg-green-900/20 rounded-lg border border-green-900/50 text-xs text-green-300">
                Tipp: Teste dein Thumbnail, indem du es verkleinerst. Ist es noch lesbar?
              </div>
            </Card>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8">
          <Link href="/create/video">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Zurück zum Video
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
            Weiter zu Review
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </main>
    </div>
  );
}

export default function ThumbnailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
      </div>
    }>
      <ThumbnailPageContent />
    </Suspense>
  );
}
