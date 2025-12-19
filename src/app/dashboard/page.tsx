"use client";

import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/app-store";
import { useWizardStore } from "@/store/wizard-store";
import { useTranslation } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LocaleSwitcher } from "@/components/locale-switcher";
import {
  PlusCircle,
  Video,
  Settings,
  Wand2,
  Wrench,
  ArrowRight,
  PlayCircle,
  FileText
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { mode } = useAppStore();
  const { channel, isComplete } = useWizardStore();

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
              Einstellungen
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
                  Schließe dein Setup ab
                </h2>
                <p className="text-zinc-400 mb-4">
                  Beende den Wizard, um deinen Kanal vollständig einzurichten und alle Features freizuschalten.
                </p>
                <Link href="/wizard/channel-setup">
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    Wizard fortsetzen
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
            Willkommen zurück{channel.name && `, ${channel.name}`}!
          </h1>
          <p className="text-xl text-zinc-400">
            Bereit, deinen nächsten Content zu erstellen?
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
                      Vollautomatische Video-Erstellung
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
                      Schritt-für-Schritt Anleitungen
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
              <h3 className="text-xl font-bold mb-2">Neues Video erstellen</h3>
              <p className="text-zinc-400 text-sm mb-4">
                Starte ein neues Video-Projekt
              </p>
              <div className="flex items-center text-purple-400 text-sm font-semibold">
                Los geht's
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </Card>
          </Link>

          {/* View Videos - Placeholder */}
          <Card className="bg-zinc-800/30 border-zinc-700/50 p-6 opacity-60 cursor-not-allowed">
            <div className="mb-4">
              <div className="w-14 h-14 rounded-xl bg-zinc-700 flex items-center justify-center">
                <Video className="w-7 h-7 text-zinc-500" />
              </div>
            </div>
            <h3 className="text-xl font-bold mb-2">Meine Videos</h3>
            <p className="text-zinc-400 text-sm mb-4">
              Verwalte deine Video-Projekte
            </p>
            <div className="flex items-center text-zinc-500 text-sm">
              {t("common.comingSoon")}
            </div>
          </Card>

          {/* Analytics - Placeholder */}
          <Card className="bg-zinc-800/30 border-zinc-700/50 p-6 opacity-60 cursor-not-allowed">
            <div className="mb-4">
              <div className="w-14 h-14 rounded-xl bg-zinc-700 flex items-center justify-center">
                <PlayCircle className="w-7 h-7 text-zinc-500" />
              </div>
            </div>
            <h3 className="text-xl font-bold mb-2">Statistiken</h3>
            <p className="text-zinc-400 text-sm mb-4">
              Verfolge deine Performance
            </p>
            <div className="flex items-center text-zinc-500 text-sm">
              {t("common.comingSoon")}
            </div>
          </Card>
        </div>

        {/* Projects List - Placeholder */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Deine Projekte</h2>
          <Card className="bg-zinc-800/30 border-zinc-700/50 p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-zinc-700/50 flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-zinc-500" />
            </div>
            <h3 className="text-lg font-semibold text-zinc-400 mb-2">
              Noch keine Projekte
            </h3>
            <p className="text-zinc-500 mb-6 max-w-md mx-auto">
              Erstelle dein erstes Video-Projekt, um hier zu starten.
            </p>
            <Link href="/create">
              <Button className="bg-purple-600 hover:bg-purple-700">
                <PlusCircle className="w-4 h-4 mr-2" />
                Erstes Projekt erstellen
              </Button>
            </Link>
          </Card>
        </div>

        {/* Channel Info */}
        {channel.name && (
          <Card className="bg-zinc-800/30 border-zinc-700/50 p-6 mt-8">
            <h3 className="text-sm font-semibold text-zinc-400 mb-4">
              Dein Kanal:
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-zinc-500 text-xs mb-1">Name</div>
                <div className="font-medium">{channel.name}</div>
              </div>
              {channel.niche && (
                <div>
                  <div className="text-zinc-500 text-xs mb-1">Nische</div>
                  <div className="font-medium">{t(`niches.${channel.niche}`)}</div>
                </div>
              )}
              {mode && (
                <div>
                  <div className="text-zinc-500 text-xs mb-1">Modus</div>
                  <div className="font-medium">
                    {mode === "auto" ? t("wizard.step4.auto.title") : t("wizard.step4.diy.title")}
                  </div>
                </div>
              )}
              {channel.targetAudience && (
                <div>
                  <div className="text-zinc-500 text-xs mb-1">Zielgruppe</div>
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
