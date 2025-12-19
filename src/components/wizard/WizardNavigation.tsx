'use client';

import { useRouter } from 'next/navigation';
import { useTranslation } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface WizardNavigationProps {
  backHref?: string;
  nextHref?: string;
  onBack?: () => void;
  onNext?: () => void;
  nextDisabled?: boolean;
  nextLabel?: string;
  backLabel?: string;
  isLastStep?: boolean;
}

export function WizardNavigation({
  backHref,
  nextHref,
  onBack,
  onNext,
  nextDisabled = false,
  nextLabel,
  backLabel,
  isLastStep = false,
}: WizardNavigationProps) {
  const router = useRouter();
  const { t } = useTranslation();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (backHref) {
      router.push(backHref);
    }
  };

  const handleNext = () => {
    if (onNext) {
      onNext();
    } else if (nextHref) {
      router.push(nextHref);
    }
  };

  return (
    <div className="flex justify-between items-center pt-6 border-t border-zinc-800">
      {backHref || onBack ? (
        <Button
          variant="outline"
          onClick={handleBack}
          className="border-zinc-700 hover:bg-zinc-800"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {backLabel || t('wizard.navigation.back')}
        </Button>
      ) : (
        <div />
      )}

      {(nextHref || onNext) && (
        <Button
          onClick={handleNext}
          disabled={nextDisabled}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
        >
          {nextLabel || (isLastStep ? t('wizard.navigation.finish') : t('wizard.navigation.next'))}
          {!isLastStep && <ArrowRight className="w-4 h-4 ml-2" />}
        </Button>
      )}
    </div>
  );
}
