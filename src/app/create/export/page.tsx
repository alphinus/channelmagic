"use client";

import { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/app-store";
import { useProjectStore } from "@/store/project-store";
import { useTranslation } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ArrowLeft,
  Loader2,
  Check,
  Copy,
  Download,
  ExternalLink,
  Video,
  Image as ImageIcon,
  CheckCircle2,
  Youtube,
} from "lucide-react";
import Link from "next/link";
import type { Platform } from "@/store/wizard-store";

function ExportPageContent() {
  const router = useRouter();
  const { t } = useTranslation();
  const { currentProject, updatePlatformContent, setStatus, updateInDatabase } = useProjectStore();

  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [checklist, setChecklist] = useState<Record<string, boolean>>({});

  const topic = currentProject?.topic || "Dein Video";

  const handleCopy = async (text: string, fieldId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldId);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleChecklistToggle = (itemId: string, checked: boolean) => {
    setChecklist((prev) => ({ ...prev, [itemId]: checked }));
  };

  const handleMarkAsPublished = async (platform: Platform) => {
    const publishedAt = new Date().toISOString();

    // Update local store
    updatePlatformContent(platform, {
      published: true,
      publishedAt,
    });

    // Sync to database
    await updateInDatabase({
      status: "published",
    });
  };

  const handleFinish = async () => {
    setStatus("ready");

    // Save final status to database
    await updateInDatabase({
      status: "ready",
    });

    router.push("/dashboard");
  };

  const getPlatformContent = (platform: Platform) => {
    return currentProject?.platformContent.find((pc) => pc.platform === platform);
  };

  const selectedPlatforms =
    currentProject?.platformContent.map((pc) => pc.platform) || [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <Link href="/create/review">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            {t("common.back")}
          </Button>
        </Link>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-400" />
          </div>
          <h1 className="text-4xl font-bold mb-3">Bereit zum Veröffentlichen!</h1>
          <p className="text-zinc-400">
            Dein Content für: <span className="text-purple-400 font-semibold">{topic}</span>
          </p>
        </div>

        {/* Video & Thumbnail Preview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-zinc-800/50 border-zinc-700 p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Video className="w-5 h-5 text-purple-400" />
              Dein Video
            </h3>
            <div className="bg-zinc-900 rounded-lg aspect-video flex items-center justify-center mb-4">
              <div className="text-center text-zinc-500">
                <Video className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Video Vorschau</p>
              </div>
            </div>
            <Button variant="outline" className="w-full gap-2">
              <Download className="w-4 h-4" />
              Video herunterladen
            </Button>
          </Card>

          <Card className="bg-zinc-800/50 border-zinc-700 p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-purple-400" />
              Dein Thumbnail
            </h3>
            <div className="bg-zinc-900 rounded-lg aspect-video flex items-center justify-center mb-4">
              <div className="text-center text-zinc-500">
                <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Thumbnail Vorschau</p>
              </div>
            </div>
            <Button variant="outline" className="w-full gap-2">
              <Download className="w-4 h-4" />
              Thumbnail herunterladen
            </Button>
          </Card>
        </div>

        {/* Platform Checklists */}
        <Card className="bg-zinc-800/50 border-zinc-700 p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6">Publishing Checklisten</h2>

          <Accordion type="single" collapsible className="w-full">
            {/* YouTube Section */}
            {selectedPlatforms.includes("youtube") && (
              <AccordionItem value="youtube">
                <AccordionTrigger className="text-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                      <Youtube className="w-5 h-5 text-red-400" />
                    </div>
                    <span>YouTube</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pt-4">
                    {/* Checklist Items */}
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-3 p-3 bg-zinc-900 rounded-lg">
                        <Checkbox
                          id="youtube-video"
                          checked={checklist["youtube-video"] || false}
                          onCheckedChange={(checked) =>
                            handleChecklistToggle("youtube-video", checked === true)
                          }
                        />
                        <Label
                          htmlFor="youtube-video"
                          className="text-sm font-normal cursor-pointer"
                        >
                          Video hochgeladen
                        </Label>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-zinc-900 rounded-lg">
                        <Checkbox
                          id="youtube-title"
                          checked={checklist["youtube-title"] || false}
                          onCheckedChange={(checked) =>
                            handleChecklistToggle("youtube-title", checked === true)
                          }
                        />
                        <Label
                          htmlFor="youtube-title"
                          className="text-sm font-normal cursor-pointer"
                        >
                          Titel eingefügt
                        </Label>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-zinc-900 rounded-lg">
                        <Checkbox
                          id="youtube-description"
                          checked={checklist["youtube-description"] || false}
                          onCheckedChange={(checked) =>
                            handleChecklistToggle(
                              "youtube-description",
                              checked === true
                            )
                          }
                        />
                        <Label
                          htmlFor="youtube-description"
                          className="text-sm font-normal cursor-pointer"
                        >
                          Beschreibung eingefügt
                        </Label>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-zinc-900 rounded-lg">
                        <Checkbox
                          id="youtube-thumbnail"
                          checked={checklist["youtube-thumbnail"] || false}
                          onCheckedChange={(checked) =>
                            handleChecklistToggle(
                              "youtube-thumbnail",
                              checked === true
                            )
                          }
                        />
                        <Label
                          htmlFor="youtube-thumbnail"
                          className="text-sm font-normal cursor-pointer"
                        >
                          Thumbnail hochgeladen
                        </Label>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-zinc-900 rounded-lg">
                        <Checkbox
                          id="youtube-tags"
                          checked={checklist["youtube-tags"] || false}
                          onCheckedChange={(checked) =>
                            handleChecklistToggle("youtube-tags", checked === true)
                          }
                        />
                        <Label
                          htmlFor="youtube-tags"
                          className="text-sm font-normal cursor-pointer"
                        >
                          Tags hinzugefügt
                        </Label>
                      </div>
                    </div>

                    {/* Content Copy Buttons */}
                    <div className="space-y-3">
                      <div className="bg-zinc-900 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <Label className="text-sm font-semibold">Titel</Label>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              handleCopy(
                                getPlatformContent("youtube")?.title || "",
                                "youtube-title-copy"
                              )
                            }
                            className="gap-2"
                          >
                            {copiedField === "youtube-title-copy" ? (
                              <>
                                <Check className="w-3 h-3" />
                                Kopiert
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                Kopieren
                              </>
                            )}
                          </Button>
                        </div>
                        <p className="text-sm text-zinc-400">
                          {getPlatformContent("youtube")?.title || "Kein Titel"}
                        </p>
                      </div>

                      <div className="bg-zinc-900 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <Label className="text-sm font-semibold">Beschreibung</Label>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              handleCopy(
                                getPlatformContent("youtube")?.description || "",
                                "youtube-desc-copy"
                              )
                            }
                            className="gap-2"
                          >
                            {copiedField === "youtube-desc-copy" ? (
                              <>
                                <Check className="w-3 h-3" />
                                Kopiert
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                Kopieren
                              </>
                            )}
                          </Button>
                        </div>
                        <p className="text-sm text-zinc-400 max-h-32 overflow-y-auto">
                          {getPlatformContent("youtube")?.description ||
                            "Keine Beschreibung"}
                        </p>
                      </div>

                      <div className="bg-zinc-900 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <Label className="text-sm font-semibold">Tags/Hashtags</Label>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              handleCopy(
                                getPlatformContent("youtube")?.hashtags.join(", ") ||
                                  "",
                                "youtube-tags-copy"
                              )
                            }
                            className="gap-2"
                          >
                            {copiedField === "youtube-tags-copy" ? (
                              <>
                                <Check className="w-3 h-3" />
                                Kopiert
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                Kopieren
                              </>
                            )}
                          </Button>
                        </div>
                        <p className="text-sm text-zinc-400">
                          {getPlatformContent("youtube")?.hashtags.join(", ") ||
                            "Keine Tags"}
                        </p>
                      </div>
                    </div>

                    {/* YouTube Studio Link */}
                    <Button
                      className="w-full gap-2 bg-red-600 hover:bg-red-700"
                      onClick={() =>
                        window.open("https://studio.youtube.com", "_blank")
                      }
                    >
                      <ExternalLink className="w-4 h-4" />
                      YouTube Studio öffnen
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

            {/* TikTok Section */}
            {selectedPlatforms.includes("tiktok") && (
              <AccordionItem value="tiktok">
                <AccordionTrigger className="text-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-pink-500/20 flex items-center justify-center">
                      <Video className="w-5 h-5 text-pink-400" />
                    </div>
                    <span>TikTok</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pt-4">
                    {/* Checklist Items */}
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-3 p-3 bg-zinc-900 rounded-lg">
                        <Checkbox
                          id="tiktok-video"
                          checked={checklist["tiktok-video"] || false}
                          onCheckedChange={(checked) =>
                            handleChecklistToggle("tiktok-video", checked === true)
                          }
                        />
                        <Label
                          htmlFor="tiktok-video"
                          className="text-sm font-normal cursor-pointer"
                        >
                          Video hochgeladen
                        </Label>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-zinc-900 rounded-lg">
                        <Checkbox
                          id="tiktok-caption"
                          checked={checklist["tiktok-caption"] || false}
                          onCheckedChange={(checked) =>
                            handleChecklistToggle("tiktok-caption", checked === true)
                          }
                        />
                        <Label
                          htmlFor="tiktok-caption"
                          className="text-sm font-normal cursor-pointer"
                        >
                          Caption eingefügt
                        </Label>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-zinc-900 rounded-lg">
                        <Checkbox
                          id="tiktok-hashtags"
                          checked={checklist["tiktok-hashtags"] || false}
                          onCheckedChange={(checked) =>
                            handleChecklistToggle("tiktok-hashtags", checked === true)
                          }
                        />
                        <Label
                          htmlFor="tiktok-hashtags"
                          className="text-sm font-normal cursor-pointer"
                        >
                          Hashtags hinzugefügt
                        </Label>
                      </div>
                    </div>

                    {/* Content Copy Buttons */}
                    <div className="space-y-3">
                      <div className="bg-zinc-900 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <Label className="text-sm font-semibold">Caption</Label>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              handleCopy(
                                getPlatformContent("tiktok")?.description || "",
                                "tiktok-caption-copy"
                              )
                            }
                            className="gap-2"
                          >
                            {copiedField === "tiktok-caption-copy" ? (
                              <>
                                <Check className="w-3 h-3" />
                                Kopiert
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                Kopieren
                              </>
                            )}
                          </Button>
                        </div>
                        <p className="text-sm text-zinc-400 max-h-32 overflow-y-auto">
                          {getPlatformContent("tiktok")?.description ||
                            "Keine Caption"}
                        </p>
                      </div>

                      <div className="bg-zinc-900 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <Label className="text-sm font-semibold">Hashtags</Label>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              handleCopy(
                                getPlatformContent("tiktok")
                                  ?.hashtags.map((h) => `#${h}`)
                                  .join(" ") || "",
                                "tiktok-tags-copy"
                              )
                            }
                            className="gap-2"
                          >
                            {copiedField === "tiktok-tags-copy" ? (
                              <>
                                <Check className="w-3 h-3" />
                                Kopiert
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                Kopieren
                              </>
                            )}
                          </Button>
                        </div>
                        <p className="text-sm text-zinc-400">
                          {getPlatformContent("tiktok")
                            ?.hashtags.map((h) => `#${h}`)
                            .join(" ") || "Keine Hashtags"}
                        </p>
                      </div>
                    </div>

                    {/* TikTok Link */}
                    <Button
                      className="w-full gap-2 bg-pink-600 hover:bg-pink-700"
                      onClick={() => window.open("https://www.tiktok.com", "_blank")}
                    >
                      <ExternalLink className="w-4 h-4" />
                      TikTok öffnen
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

            {/* Instagram Section */}
            {selectedPlatforms.includes("instagram") && (
              <AccordionItem value="instagram">
                <AccordionTrigger className="text-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                      <Video className="w-5 h-5 text-purple-400" />
                    </div>
                    <span>Instagram</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pt-4">
                    {/* Checklist Items */}
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-3 p-3 bg-zinc-900 rounded-lg">
                        <Checkbox
                          id="instagram-reel"
                          checked={checklist["instagram-reel"] || false}
                          onCheckedChange={(checked) =>
                            handleChecklistToggle("instagram-reel", checked === true)
                          }
                        />
                        <Label
                          htmlFor="instagram-reel"
                          className="text-sm font-normal cursor-pointer"
                        >
                          Als Reel hochgeladen
                        </Label>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-zinc-900 rounded-lg">
                        <Checkbox
                          id="instagram-caption"
                          checked={checklist["instagram-caption"] || false}
                          onCheckedChange={(checked) =>
                            handleChecklistToggle(
                              "instagram-caption",
                              checked === true
                            )
                          }
                        />
                        <Label
                          htmlFor="instagram-caption"
                          className="text-sm font-normal cursor-pointer"
                        >
                          Caption eingefügt
                        </Label>
                      </div>
                    </div>

                    {/* Content Copy Buttons */}
                    <div className="space-y-3">
                      <div className="bg-zinc-900 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <Label className="text-sm font-semibold">Caption</Label>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              handleCopy(
                                getPlatformContent("instagram")?.description || "",
                                "instagram-caption-copy"
                              )
                            }
                            className="gap-2"
                          >
                            {copiedField === "instagram-caption-copy" ? (
                              <>
                                <Check className="w-3 h-3" />
                                Kopiert
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                Kopieren
                              </>
                            )}
                          </Button>
                        </div>
                        <p className="text-sm text-zinc-400 max-h-32 overflow-y-auto">
                          {getPlatformContent("instagram")?.description ||
                            "Keine Caption"}
                        </p>
                      </div>

                      <div className="bg-zinc-900 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <Label className="text-sm font-semibold">Hashtags</Label>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              handleCopy(
                                getPlatformContent("instagram")
                                  ?.hashtags.map((h) => `#${h}`)
                                  .join(" ") || "",
                                "instagram-tags-copy"
                              )
                            }
                            className="gap-2"
                          >
                            {copiedField === "instagram-tags-copy" ? (
                              <>
                                <Check className="w-3 h-3" />
                                Kopiert
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                Kopieren
                              </>
                            )}
                          </Button>
                        </div>
                        <p className="text-sm text-zinc-400">
                          {getPlatformContent("instagram")
                            ?.hashtags.map((h) => `#${h}`)
                            .join(" ") || "Keine Hashtags"}
                        </p>
                      </div>
                    </div>

                    {/* Instagram Link */}
                    <Button
                      className="w-full gap-2 bg-purple-600 hover:bg-purple-700"
                      onClick={() =>
                        window.open("https://www.instagram.com", "_blank")
                      }
                    >
                      <ExternalLink className="w-4 h-4" />
                      Instagram öffnen
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}
          </Accordion>
        </Card>

        {/* Finish Button */}
        <div className="flex justify-between items-center">
          <Link href="/create/review">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Zurück zur Review
            </Button>
          </Link>

          <Button
            onClick={handleFinish}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 gap-2 px-8"
          >
            <CheckCircle2 className="w-5 h-5" />
            Fertig - Zum Dashboard
          </Button>
        </div>
      </main>
    </div>
  );
}

export default function ExportPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white flex items-center justify-center">
          <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
        </div>
      }
    >
      <ExportPageContent />
    </Suspense>
  );
}
