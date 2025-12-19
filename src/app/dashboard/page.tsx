"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/app-store";
import { useWizardStore } from "@/store/wizard-store";
import { useTranslation } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { ProjectCard } from "@/components/dashboard/ProjectCard";
import {
  PlusCircle,
  Video,
  Settings,
  Wand2,
  Wrench,
  ArrowRight,
  PlayCircle,
  FileText,
  Loader2
} from "lucide-react";
import Link from "next/link";

interface VideoProject {
  id: string;
  topic: string;
  status: 'draft' | 'processing' | 'ready' | 'published';
  thumbnail_url?: string;
  platforms: string[];
  created_at: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { mode } = useAppStore();
  const { channel, isComplete } = useWizardStore();
  const [videos, setVideos] = useState<VideoProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/videos');
      if (response.ok) {
        const data = await response.json();
        setVideos(data);
      }
    } catch (error) {
      console.error('Failed to load videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVideo = async (id: string) => {
    try {
      const response = await fetch(`/api/videos/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setVideos(videos.filter(v => v.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete video:', error);
    }
  };

  const handleEditVideo = (id: string) => {
    router.push(`/dashboard/videos/${id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white">
      {/* Header */}
      <header className="border-b border-zinc-800">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/">
            <div className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              ChannelMagic
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <LocaleSwitcher />
            <Button variant="ghost" size="sm" className="gap-2">
              <Settings className="w-4 h-4" />
              {t('dashboard.settings')}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Wizard Not Complete - Show Setup CTA */}
        {!isComplete && (
          <Card className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border-purple-500/30 p-8 mb-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shrink-0">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold mb-2">
                  {t('dashboard.completeSetup')}
                </h2>
                <p className="text-zinc-400 mb-4">
                  {t('dashboard.completeSetupDescription')}
                </p>
                <Link href="/wizard/channel-setup">
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    {t('dashboard.continueWizard')}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        )}

        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            {t('dashboard.welcome')}{channel.name && `, ${channel.name}`}!
          </h1>
          <p className="text-xl text-zinc-400">
            {t('dashboard.welcomeSubtitle')}
          </p>
        </div>

        {/* Mode Badge */}
        {mode && (
          <div className="mb-8">
            <div className="inline-flex items-center gap-3 px-4 py-3 bg-zinc-800/50 rounded-lg border border-zinc-700">
              {mode === "auto" ? (
                <>
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <Wand2 className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">
                      {t("wizard.step4.auto.title")}
                    </div>
                    <div className="text-xs text-zinc-500">
                      {t('dashboard.autoModeDescription')}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                    <Wrench className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold flex items-center gap-2">
                      {t("wizard.step4.diy.title")}
                      <span className="px-2 py-0.5 rounded-full bg-green-500 text-white text-xs">
                        {t("common.free")}
                      </span>
                    </div>
                    <div className="text-xs text-zinc-500">
                      {t('dashboard.diyModeDescription')}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Create New Video */}
          <Link href="/create">
            <Card className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-purple-500/30 p-6 hover:border-purple-500 transition-all cursor-pointer group">
              <div className="mb-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <PlusCircle className="w-7 h-7 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2">{t('dashboard.createNewVideo')}</h3>
              <p className="text-zinc-400 text-sm mb-4">
                {t('dashboard.createNewVideoDescription')}
              </p>
              <div className="flex items-center text-purple-400 text-sm font-semibold">
                {t('dashboard.letsGo')}
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </Card>
          </Link>

          {/* View Videos */}
          <Card className="bg-zinc-800/30 border-zinc-700/50 p-6 hover:border-zinc-600 transition-all cursor-pointer group">
            <div className="mb-4">
              <div className="w-14 h-14 rounded-xl bg-zinc-700 flex items-center justify-center group-hover:bg-zinc-600 transition-colors">
                <Video className="w-7 h-7 text-zinc-300" />
              </div>
            </div>
            <h3 className="text-xl font-bold mb-2">{t('dashboard.myVideos')}</h3>
            <p className="text-zinc-400 text-sm mb-4">
              {t('dashboard.myVideosDescription')}
            </p>
            <div className="flex items-center text-zinc-400 text-sm">
              {videos.length} {videos.length === 1 ? t('dashboard.project') : t('dashboard.projects')}
            </div>
          </Card>

          {/* Analytics - Placeholder */}
          <Card className="bg-zinc-800/30 border-zinc-700/50 p-6 opacity-60 cursor-not-allowed">
            <div className="mb-4">
              <div className="w-14 h-14 rounded-xl bg-zinc-700 flex items-center justify-center">
                <PlayCircle className="w-7 h-7 text-zinc-500" />
              </div>
            </div>
            <h3 className="text-xl font-bold mb-2">{t('dashboard.analytics')}</h3>
            <p className="text-zinc-400 text-sm mb-4">
              {t('dashboard.analyticsDescription')}
            </p>
            <div className="flex items-center text-zinc-500 text-sm">
              {t("common.comingSoon")}
            </div>
          </Card>
        </div>

        {/* Projects List */}
        <div>
          <h2 className="text-2xl font-bold mb-6">{t('dashboard.yourProjects')}</h2>

          {loading ? (
            <div className="grid md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="bg-zinc-800/30 border-zinc-700/50 p-0 overflow-hidden">
                  <div className="aspect-video w-full bg-zinc-800/50 animate-pulse" />
                  <div className="p-4 space-y-3">
                    <div className="h-6 bg-zinc-700/50 rounded animate-pulse" />
                    <div className="h-4 bg-zinc-700/50 rounded w-2/3 animate-pulse" />
                  </div>
                </Card>
              ))}
            </div>
          ) : videos.length === 0 ? (
            <Card className="bg-zinc-800/30 border-zinc-700/50 p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-zinc-700/50 flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-zinc-500" />
              </div>
              <h3 className="text-lg font-semibold text-zinc-400 mb-2">
                {t('dashboard.noProjects')}
              </h3>
              <p className="text-zinc-500 mb-6 max-w-md mx-auto">
                {t('dashboard.noProjectsDescription')}
              </p>
              <Link href="/create">
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <PlusCircle className="w-4 h-4 mr-2" />
                  {t('dashboard.createFirstProject')}
                </Button>
              </Link>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {videos.map((video) => (
                <ProjectCard
                  key={video.id}
                  id={video.id}
                  topic={video.topic}
                  status={video.status}
                  thumbnailUrl={video.thumbnail_url}
                  platforms={video.platforms}
                  createdAt={video.created_at}
                  onEdit={() => handleEditVideo(video.id)}
                  onDelete={() => handleDeleteVideo(video.id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Channel Info */}
        {channel.name && (
          <Card className="bg-zinc-800/30 border-zinc-700/50 p-6 mt-8">
            <h3 className="text-sm font-semibold text-zinc-400 mb-4">
              {t('dashboard.yourChannel')}:
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-zinc-500 text-xs mb-1">{t('dashboard.channelName')}</div>
                <div className="font-medium">{channel.name}</div>
              </div>
              {channel.niche && (
                <div>
                  <div className="text-zinc-500 text-xs mb-1">{t('dashboard.niche')}</div>
                  <div className="font-medium">{t(`niches.${channel.niche}`)}</div>
                </div>
              )}
              {mode && (
                <div>
                  <div className="text-zinc-500 text-xs mb-1">{t('dashboard.mode')}</div>
                  <div className="font-medium">
                    {mode === "auto" ? t("wizard.step4.auto.title") : t("wizard.step4.diy.title")}
                  </div>
                </div>
              )}
              {channel.targetAudience && (
                <div>
                  <div className="text-zinc-500 text-xs mb-1">{t('dashboard.targetAudience')}</div>
                  <div className="font-medium truncate">{channel.targetAudience}</div>
                </div>
              )}
            </div>
          </Card>
        )}
      </main>
    </div>
  );
}
