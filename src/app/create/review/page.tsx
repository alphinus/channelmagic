"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/app-store";
import { useProjectStore } from "@/store/project-store";
import { useTranslation } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  ArrowRight,
  Loader2,
  Check,
  X,
  Sparkles,
  Video,
  Image as ImageIcon,
  FileText,
  Hash,
} from "lucide-react";
import Link from "next/link";
import type { Platform } from "@/store/wizard-store";

interface PlatformLimits {
  title: number;
  description: number;
  hashtags: number;
}

const PLATFORM_LIMITS: Record<Platform, PlatformLimits> = {
  youtube: { title: 100, description: 5000, hashtags: 15 },
  tiktok: { title: 100, description: 2200, hashtags: 30 },
  instagram: { title: 0, description: 2200, hashtags: 30 }, // Title not applicable for Instagram
};

function ReviewPageContent() {
  const router = useRouter();
  const { t } = useTranslation();
  const { mode } = useAppStore();
  const { currentProject, updatePlatformContent, setStatus, updateInDatabase } = useProjectStore();

  const [editedContent, setEditedContent] = useState<
    Record<Platform, { title: string; description: string; hashtags: string[] }>
  >({
    youtube: { title: "", description: "", hashtags: [] },
    tiktok: { title: "", description: "", hashtags: [] },
    instagram: { title: "", description: "", hashtags: [] },
  });

  const [isGeneratingHashtags, setIsGeneratingHashtags] = useState<
    Partial<Record<Platform, boolean>>
  >({});

  const topic = currentProject?.topic || "Dein Video";
  const script = currentProject?.script?.fullText || "";

  // Initialize edited content from project store
  useEffect(() => {
    if (currentProject?.platformContent) {
      const initialContent: Record<
        Platform,
        { title: string; description: string; hashtags: string[] }
      > = {
        youtube: { title: "", description: "", hashtags: [] },
        tiktok: { title: "", description: "", hashtags: [] },
        instagram: { title: "", description: "", hashtags: [] },
      };

      currentProject.platformContent.forEach((content) => {
        initialContent[content.platform] = {
          title: content.title || "",
          description: content.description || "",
          hashtags: content.hashtags || [],
        };
      });

      setEditedContent(initialContent);
    }
  }, [currentProject]);

  const handleTitleChange = (platform: Platform, value: string) => {
    const limit = PLATFORM_LIMITS[platform].title;
    if (value.length <= limit) {
      setEditedContent((prev) => ({
        ...prev,
        [platform]: { ...prev[platform], title: value },
      }));
    }
  };

  const handleDescriptionChange = (platform: Platform, value: string) => {
    const limit = PLATFORM_LIMITS[platform].description;
    if (value.length <= limit) {
      setEditedContent((prev) => ({
        ...prev,
        [platform]: { ...prev[platform], description: value },
      }));
    }
  };

  const handleRemoveHashtag = (platform: Platform, hashtag: string) => {
    setEditedContent((prev) => ({
      ...prev,
      [platform]: {
        ...prev[platform],
        hashtags: prev[platform].hashtags.filter((h) => h !== hashtag),
      },
    }));
  };

  const handleGenerateHashtags = async (platform: Platform) => {
    setIsGeneratingHashtags((prev) => ({ ...prev, [platform]: true }));

    try {
      const response = await fetch("/api/generate/hashtags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          platform,
          script: script.substring(0, 500), // Send first 500 chars for context
        }),
      });

      if (!response.ok) {
        throw new Error("Fehler beim Generieren der Hashtags");
      }

      const data = await response.json();
      setEditedContent((prev) => ({
        ...prev,
        [platform]: {
          ...prev[platform],
          hashtags: data.hashtags || [],
        },
      }));
    } catch (err) {
      console.error("Error generating hashtags:", err);
    } finally {
      setIsGeneratingHashtags((prev) => ({ ...prev, [platform]: false }));
    }
  };

  const handleSave = () => {
    // Save all platform content to store
    Object.entries(editedContent).forEach(([platform, content]) => {
      if (
        currentProject?.platformContent.some((pc) => pc.platform === platform)
      ) {
        updatePlatformContent(platform as Platform, {
          title: content.title,
          description: content.description,
          hashtags: content.hashtags,
        });
      }
    });

    setStatus("review");
  };

  const handleNext = async () => {
    handleSave();

    // Save review status to database
    await updateInDatabase({
      status: "review",
    });

    router.push("/create/export");
  };

  const getPlatformIcon = (platform: Platform) => {
    switch (platform) {
      case "youtube":
        return (
          <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
            <Video className="w-5 h-5 text-red-400" />
          </div>
        );
      case "tiktok":
        return (
          <div className="w-10 h-10 rounded-lg bg-pink-500/20 flex items-center justify-center">
            <Video className="w-5 h-5 text-pink-400" />
          </div>
        );
      case "instagram":
        return (
          <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
            <Video className="w-5 h-5 text-purple-400" />
          </div>
        );
    }
  };

  const getPlatformName = (platform: Platform): string => {
    switch (platform) {
      case "youtube":
        return "YouTube";
      case "tiktok":
        return "TikTok";
      case "instagram":
        return "Instagram";
    }
  };

  // Get selected platforms from project
  const selectedPlatforms =
    currentProject?.platformContent.map((pc) => pc.platform) || [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <Link href="/create/thumbnail">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            {t("common.back")}
          </Button>
        </Link>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-3">Content Review</h1>
          <p className="text-zinc-400">
            Thema: <span className="text-purple-400 font-semibold">{topic}</span>
          </p>
        </div>

        {/* Summary Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Script Preview */}
          <Card className="bg-zinc-800/50 border-zinc-700 p-6">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-400" />
              Script-Preview
            </h3>
            <div className="bg-zinc-900 rounded-lg p-4 max-h-[150px] overflow-y-auto">
              <p className="text-sm text-zinc-300 whitespace-pre-wrap">
                {script.substring(0, 300)}
                {script.length > 300 ? "..." : ""}
              </p>
            </div>
          </Card>

          {/* Video/Thumbnail Preview */}
          <Card className="bg-zinc-800/50 border-zinc-700 p-6">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-purple-400" />
              Thumbnail
            </h3>
            <div className="bg-zinc-900 rounded-lg aspect-video flex items-center justify-center">
              <div className="text-center text-zinc-500">
                <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Thumbnail Vorschau</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Platform Content Cards */}
        <div className="space-y-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Plattform-spezifischer Content</h2>

          {selectedPlatforms.map((platform) => (
            <Card
              key={platform}
              className="bg-zinc-800/50 border-zinc-700 p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                {getPlatformIcon(platform)}
                <div>
                  <h3 className="text-xl font-bold">{getPlatformName(platform)}</h3>
                  <p className="text-sm text-zinc-400">
                    Optimiere deinen Content für {getPlatformName(platform)}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Title Input (not for Instagram) */}
                {platform !== "instagram" && (
                  <div>
                    <Label htmlFor={`${platform}-title`} className="mb-2 block">
                      Titel
                      <span className="text-xs text-zinc-500 ml-2">
                        ({editedContent[platform].title.length}/
                        {PLATFORM_LIMITS[platform].title})
                      </span>
                    </Label>
                    <Input
                      id={`${platform}-title`}
                      value={editedContent[platform].title}
                      onChange={(e) => handleTitleChange(platform, e.target.value)}
                      placeholder={`Titel für ${getPlatformName(platform)}...`}
                      className="bg-zinc-900 border-zinc-700"
                    />
                  </div>
                )}

                {/* Description Textarea */}
                <div>
                  <Label
                    htmlFor={`${platform}-description`}
                    className="mb-2 block"
                  >
                    {platform === "instagram" ? "Caption" : "Beschreibung"}
                    <span className="text-xs text-zinc-500 ml-2">
                      ({editedContent[platform].description.length}/
                      {PLATFORM_LIMITS[platform].description})
                    </span>
                  </Label>
                  <Textarea
                    id={`${platform}-description`}
                    value={editedContent[platform].description}
                    onChange={(e) =>
                      handleDescriptionChange(platform, e.target.value)
                    }
                    placeholder={`Beschreibung für ${getPlatformName(platform)}...`}
                    className="bg-zinc-900 border-zinc-700 min-h-[120px]"
                  />
                </div>

                {/* Hashtags */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>
                      Hashtags
                      <span className="text-xs text-zinc-500 ml-2">
                        ({editedContent[platform].hashtags.length}/
                        {PLATFORM_LIMITS[platform].hashtags})
                      </span>
                    </Label>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleGenerateHashtags(platform)}
                      disabled={isGeneratingHashtags[platform]}
                      className="gap-2"
                    >
                      {isGeneratingHashtags[platform] ? (
                        <>
                          <Loader2 className="w-3 h-3 animate-spin" />
                          Generiere...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3 h-3" />
                          Hashtags generieren
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="bg-zinc-900 rounded-lg p-4 min-h-[60px]">
                    {editedContent[platform].hashtags.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {editedContent[platform].hashtags.map((hashtag) => (
                          <div
                            key={hashtag}
                            className="inline-flex items-center gap-1 bg-zinc-800 px-3 py-1 rounded-full text-sm"
                          >
                            <Hash className="w-3 h-3 text-zinc-400" />
                            {hashtag}
                            <button
                              onClick={() => handleRemoveHashtag(platform, hashtag)}
                              className="ml-1 hover:text-red-400 transition-colors"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-zinc-500 text-center py-2">
                        Noch keine Hashtags. Klicke auf "Hashtags generieren"
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center">
          <Link href="/create/thumbnail">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Zurück
            </Button>
          </Link>

          <div className="flex gap-3">
            <Button
              onClick={handleSave}
              variant="outline"
              className="gap-2"
            >
              <Check className="w-4 h-4" />
              Speichern
            </Button>

            <Button
              onClick={handleNext}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 gap-2"
            >
              Zum Export
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function ReviewPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white flex items-center justify-center">
          <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
        </div>
      }
    >
      <ReviewPageContent />
    </Suspense>
  );
}
