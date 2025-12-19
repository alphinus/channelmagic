'use client';

import { ReactNode } from 'react';
import { useWizardStore } from '@/store/wizard-store';
import { useTranslation } from '@/lib/i18n';
import { WizardProgress } from './WizardProgress';
import { MagicAssistant } from './MagicAssistant';

interface WizardLayoutProps {
  children: ReactNode;
  step: number;
  totalSteps?: number;
}

export function WizardLayout({ children, step, totalSteps = 6 }: WizardLayoutProps) {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950">
      <div className="container mx-auto px-4 py-8">
        <WizardProgress current={step} total={totalSteps} />

        <div className="grid lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2">
            {children}
          </div>

          <div className="lg:col-span-1">
            <MagicAssistant step={step} />
          </div>
        </div>
      </div>
    </div>
  );
}
