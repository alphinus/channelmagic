"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { useTranslation } from "@/lib/i18n";
import { Wand2, Wrench, Youtube, Check } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const { t, tArray } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-900 to-black text-white">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
          ChannelMagic
        </div>
        <div className="flex items-center gap-4">
          <LocaleSwitcher />
          <Link href="/wizard/channel-setup">
            <Button
              variant="outline"
              className="border-purple-500 text-purple-400 hover:bg-purple-500/10"
            >
              {t("common.start")}
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto mb-24">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            {t("landing.hero.title").split(" ").slice(0, 3).join(" ")}
            <br />
            <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
              {t("landing.hero.title").split(" ").slice(3).join(" ")}
            </span>
          </h1>

          <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-12">
            {t("landing.hero.subtitle")}
          </p>

          <Link href="/wizard/channel-setup">
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg px-8 py-6 h-auto"
            >
              {t("landing.hero.cta")}
            </Button>
          </Link>
        </div>

        {/* Features Section */}
        <div className="mb-24">
          <h2 className="text-3xl font-bold text-center mb-12">
            {t("landing.features.title")}
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Auto Mode Feature */}
            <Card className="bg-zinc-800/50 border-zinc-700 p-6 hover:border-purple-500/50 transition-colors">
              <div className="mb-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Wand2 className="w-7 h-7 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2">
                {t("landing.features.auto.title")}
              </h3>
              <p className="text-zinc-400">
                {t("landing.features.auto.description")}
              </p>
            </Card>

            {/* DIY Mode Feature */}
            <Card className="bg-zinc-800/50 border-zinc-700 p-6 hover:border-green-500/50 transition-colors">
              <div className="mb-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                  <Wrench className="w-7 h-7 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2">
                {t("landing.features.diy.title")}
              </h3>
              <p className="text-zinc-400">
                {t("landing.features.diy.description")}
              </p>
            </Card>

            {/* Multi-Platform Feature */}
            <Card className="bg-zinc-800/50 border-zinc-700 p-6 hover:border-blue-500/50 transition-colors">
              <div className="mb-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <Youtube className="w-7 h-7 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2">
                {t("landing.features.multiPlatform.title")}
              </h3>
              <p className="text-zinc-400">
                {t("landing.features.multiPlatform.description")}
              </p>
            </Card>
          </div>
        </div>

        {/* Modes Preview Section */}
        <div className="mb-24">
          <h2 className="text-3xl font-bold text-center mb-12">
            {t("landing.modes.title")}
          </h2>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Auto Mode Card */}
            <Card className="relative bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-purple-500/30 p-8 hover:border-purple-500 transition-all">
              <div className="absolute top-4 right-4">
                <div className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-500/30">
                  {t("landing.modes.auto.badge")}
                </div>
              </div>

              <div className="mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4">
                  <Wand2 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-2">
                  {t("landing.modes.auto.title")}
                </h3>
                <p className="text-zinc-400 mb-4">
                  {t("landing.modes.auto.description")}
                </p>
              </div>

              <div className="space-y-2 mb-6">
                {tArray("wizard.step4.auto.features").slice(0, 3).map(
                  (feature, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                      <span className="text-sm text-zinc-300">{feature}</span>
                    </div>
                  ),
                )}
              </div>

              <div className="pt-4 border-t border-zinc-700">
                <p className="text-sm text-zinc-500">
                  {t("landing.modes.auto.cost")}
                </p>
              </div>
            </Card>

            {/* DIY Mode Card */}
            <Card className="relative bg-gradient-to-br from-green-900/20 to-emerald-900/20 border-green-500/30 p-8 hover:border-green-500 transition-all">
              <div className="absolute top-4 right-4">
                <div className="px-3 py-1 rounded-full bg-green-500 text-white text-xs font-bold">
                  {t("landing.modes.diy.badge")}
                </div>
              </div>

              <div className="mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mb-4">
                  <Wrench className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-2">
                  {t("landing.modes.diy.title")}
                </h3>
                <p className="text-zinc-400 mb-4">
                  {t("landing.modes.diy.description")}
                </p>
              </div>

              <div className="space-y-2 mb-6">
                {tArray("wizard.step4.diy.features").slice(0, 3).map(
                  (feature, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                      <span className="text-sm text-zinc-300">{feature}</span>
                    </div>
                  ),
                )}
              </div>

              <div className="pt-4 border-t border-zinc-700">
                <p className="text-sm text-green-400 font-medium">
                  {t("wizard.step4.diy.tools")}
                </p>
              </div>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl p-12 border border-purple-500/20">
            <h2 className="text-3xl font-bold mb-4">
              Bereit durchzustarten?
            </h2>
            <p className="text-zinc-400 mb-8">
              Starte jetzt mit dem Wizard und erstelle deinen ersten Video-Content in wenigen Minuten.
            </p>
            <Link href="/wizard/channel-setup">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg px-8 py-6 h-auto"
              >
                {t("landing.hero.cta")}
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 mt-20 border-t border-zinc-800 text-center text-zinc-500">
        <p>ChannelMagic - Powered by AI</p>
      </footer>
    </div>
  );
}
