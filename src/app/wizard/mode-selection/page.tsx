"use client";

import { useRouter } from "next/navigation";
import { useWizardStore } from "@/store/wizard-store";
import { useAppStore } from "@/store/app-store";
import { useTranslation } from "@/lib/i18n";
import { WizardLayout } from "@/components/wizard/WizardLayout";
import { WizardNavigation } from "@/components/wizard/WizardNavigation";
import { Card } from "@/components/ui/card";
import { Wand2, Wrench, Check } from "lucide-react";

export default function ModeSelectionPage() {
  const router = useRouter();
  const { t, tArray } = useTranslation();
  const { setCurrentStep } = useWizardStore();
  const { mode, setMode } = useAppStore();

  const handleModeSelect = (selectedMode: "auto" | "diy") => {
    setMode(selectedMode);
  };

  const handleNext = () => {
    if (mode) {
      setCurrentStep(5);
      router.push("/wizard/setup");
    }
  };

  const handleBack = () => {
    setCurrentStep(3);
    router.push("/wizard/platforms");
  };

  return (
    <WizardLayout step={4}>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-3">{t("wizard.step4.title")}</h1>
          <p className="text-zinc-400">{t("wizard.step4.subtitle")}</p>
        </div>

        {/* Mode Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Auto Mode Card */}
          <button
            onClick={() => handleModeSelect("auto")}
            className={`relative p-8 rounded-2xl border-2 transition-all duration-300 text-left ${
              mode === "auto"
                ? "border-purple-500 bg-purple-500/10 shadow-xl shadow-purple-500/20"
                : "border-zinc-700 bg-zinc-800/50 hover:border-purple-400 hover:bg-zinc-800"
            }`}
          >
            {/* Selected Indicator */}
            {mode === "auto" && (
              <div className="absolute top-4 right-4 w-7 h-7 rounded-full bg-purple-500 flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
            )}

            {/* Icon */}
            <div className="mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Wand2 className="w-8 h-8 text-white" />
              </div>
            </div>

            {/* Title */}
            <h3 className="text-2xl font-bold mb-3">
              {t("wizard.step4.auto.title")}
            </h3>

            {/* Description */}
            <p className="text-zinc-400 mb-6">
              {t("wizard.step4.auto.description")}
            </p>

            {/* Features */}
            <div className="space-y-3 mb-6">
              {tArray("wizard.step4.auto.features").map(
                (feature, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                    <span className="text-sm text-zinc-300">{feature}</span>
                  </div>
                ),
              )}
            </div>

            {/* Requirements */}
            <div className="pt-6 border-t border-zinc-700 space-y-2">
              <div className="text-sm text-amber-400 font-medium">
                {t("wizard.step4.auto.requires")}
              </div>
              <div className="text-sm text-zinc-500">
                {t("wizard.step4.auto.cost")}
              </div>
            </div>
          </button>

          {/* DIY Mode Card */}
          <button
            onClick={() => handleModeSelect("diy")}
            className={`relative p-8 rounded-2xl border-2 transition-all duration-300 text-left ${
              mode === "diy"
                ? "border-green-500 bg-green-500/10 shadow-xl shadow-green-500/20"
                : "border-zinc-700 bg-zinc-800/50 hover:border-green-400 hover:bg-zinc-800"
            }`}
          >
            {/* Selected Indicator */}
            {mode === "diy" && (
              <div className="absolute top-4 right-4 w-7 h-7 rounded-full bg-green-500 flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
            )}

            {/* Badge */}
            <div className="absolute top-4 left-4">
              <div className="px-3 py-1 rounded-full bg-green-500 text-white text-xs font-bold">
                {t("wizard.step4.diy.badge")}
              </div>
            </div>

            {/* Icon */}
            <div className="mb-6 mt-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                <Wrench className="w-8 h-8 text-white" />
              </div>
            </div>

            {/* Title */}
            <h3 className="text-2xl font-bold mb-3">
              {t("wizard.step4.diy.title")}
            </h3>

            {/* Description */}
            <p className="text-zinc-400 mb-6">
              {t("wizard.step4.diy.description")}
            </p>

            {/* Features */}
            <div className="space-y-3 mb-6">
              {tArray("wizard.step4.diy.features").map(
                (feature, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                    <span className="text-sm text-zinc-300">{feature}</span>
                  </div>
                ),
              )}
            </div>

            {/* Tools */}
            <div className="pt-6 border-t border-zinc-700">
              <div className="text-sm text-green-400 font-medium">
                {t("wizard.step4.diy.tools")}
              </div>
            </div>
          </button>
        </div>

        {/* Navigation */}
        <WizardNavigation
          onBack={handleBack}
          onNext={handleNext}
          nextDisabled={!mode}
        />
      </div>
    </WizardLayout>
  );
}
