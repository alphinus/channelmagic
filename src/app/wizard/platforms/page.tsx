"use client";

import { useRouter } from "next/navigation";
import { useWizardStore } from "@/store/wizard-store";
import { useTranslation } from "@/lib/i18n";
import { getPlatformConfig } from "@/lib/platforms/config";
import type { Platform } from "@/lib/platforms/config";
import { WizardLayout } from "@/components/wizard/WizardLayout";
import { WizardNavigation } from "@/components/wizard/WizardNavigation";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";

const PLATFORMS: Platform[] = ["youtube", "tiktok", "instagram"];

export default function PlatformsPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { platforms, togglePlatform, setCurrentStep } = useWizardStore();

  const handleNext = () => {
    if (platforms.length > 0) {
      setCurrentStep(4);
      router.push("/wizard/mode-selection");
    }
  };

  const handleBack = () => {
    setCurrentStep(2);
    router.push("/wizard/content-strategy");
  };

  return (
    <WizardLayout step={3}>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-3">{t("wizard.step3.title")}</h1>
          <p className="text-zinc-400">{t("wizard.step3.subtitle")}</p>
        </div>

        {/* Platform Cards */}
        <div className="grid md:grid-cols-3 gap-4">
          {PLATFORMS.map((platform) => {
            const config = getPlatformConfig(platform);
            const isSelected = platforms.includes(platform);

            return (
              <button
                key={platform}
                onClick={() => togglePlatform(platform)}
                className={`relative p-6 rounded-xl border-2 transition-all duration-300 ${
                  isSelected
                    ? "border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/20"
                    : "border-zinc-700 bg-zinc-800/50 hover:border-purple-400 hover:bg-zinc-800"
                }`}
              >
                {/* Selected Indicator */}
                {isSelected && (
                  <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}

                {/* Icon */}
                <div className="text-5xl mb-4">{config.icon}</div>

                {/* Name */}
                <h3 className="text-xl font-bold mb-2">{config.name}</h3>

                {/* Format Info */}
                <div className="text-sm text-zinc-400 space-y-1">
                  {Object.entries(config.formats).map(
                    ([formatName, formatData]) => {
                      const format = formatData as {
                        ratio: string;
                        maxDuration?: number;
                      };
                      return (
                        <div key={formatName}>
                          {format.ratio}
                          {format.maxDuration &&
                            ` • max ${format.maxDuration}s`}
                        </div>
                      );
                    },
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Hint */}
        <Card className="bg-zinc-800/30 border-zinc-700 p-4">
          <p className="text-sm text-zinc-400 text-center">
            {t("wizard.step3.hint")}
          </p>
        </Card>

        {/* Navigation */}
        <WizardNavigation
          onBack={handleBack}
          onNext={handleNext}
          nextDisabled={platforms.length === 0}
        />
      </div>
    </WizardLayout>
  );
}
