'use client';

import { useTranslation } from '@/lib/i18n';
import { useAppStore } from '@/store/app-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MagicAssistantProps {
  step: number;
}

const tipKeys: Record<number, string> = {
  1: 'step1',
  2: 'step2',
  3: 'step3',
  4: 'step4',
  5: 'step5auto', // Will be overridden based on mode
  6: 'step6',
};

export function MagicAssistant({ step }: MagicAssistantProps) {
  const { t } = useTranslation();
  const mode = useAppStore((state) => state.mode);

  let tipKey = tipKeys[step];
  if (step === 5) {
    tipKey = mode === 'diy' ? 'step5diy' : 'step5auto';
  }

  return (
    <Card className="bg-zinc-900/50 border-zinc-800 sticky top-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <span className="text-2xl">✨</span>
          {t('assistant.title')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-zinc-400 text-sm leading-relaxed">
          {t(`assistant.tips.${tipKey}`)}
        </p>
      </CardContent>
    </Card>
  );
}
