'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useWizardStore, type Niche } from '@/store/wizard-store';
import { useTranslation } from '@/lib/i18n';
import { WizardLayout } from '@/components/wizard/WizardLayout';
import { WizardNavigation } from '@/components/wizard/WizardNavigation';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const niches: { value: Niche; label: string }[] = [
  { value: 'fitness', label: 'Fitness & Health' },
  { value: 'finance', label: 'Finance & Business' },
  { value: 'gaming', label: 'Gaming' },
  { value: 'cooking', label: 'Cooking & Food' },
  { value: 'tech', label: 'Technology' },
  { value: 'lifestyle', label: 'Lifestyle' },
  { value: 'education', label: 'Education' },
  { value: 'music', label: 'Music' },
  { value: 'business', label: 'Business' },
  { value: 'travel', label: 'Travel' },
  { value: 'other', label: 'Other' },
];

export default function ChannelSetupPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { channel, setChannel, setCurrentStep, canProceed } = useWizardStore();

  const [channelName, setChannelName] = useState(channel.name);
  const [selectedNiche, setSelectedNiche] = useState<Niche | null>(channel.niche);
  const [targetAudience, setTargetAudience] = useState(channel.targetAudience);
  const [customNiche, setCustomNiche] = useState(channel.customNiche || '');

  // Set current step on mount
  useEffect(() => {
    setCurrentStep(1);
  }, [setCurrentStep]);

  // Update store when values change
  useEffect(() => {
    setChannel({
      name: channelName,
      niche: selectedNiche,
      targetAudience,
      customNiche: selectedNiche === 'other' ? customNiche : undefined,
    });
  }, [channelName, selectedNiche, targetAudience, customNiche, setChannel]);

  const handleNext = () => {
    if (canProceed(1)) {
      router.push('/wizard/content-strategy');
    }
  };

  const isValid = canProceed(1);

  return (
    <WizardLayout step={1}>
      <Card className="bg-zinc-900 border-zinc-800 p-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Channel Setup
            </h1>
            <p className="text-zinc-400">
              Let's start by setting up the basics of your channel
            </p>
          </div>

          <div className="space-y-6">
            {/* Channel Name */}
            <div className="space-y-2">
              <Label htmlFor="channel-name" className="text-zinc-200 text-base">
                Channel Name *
              </Label>
              <Input
                id="channel-name"
                placeholder="Enter your channel name"
                value={channelName}
                onChange={(e) => setChannelName(e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                autoFocus
              />
              <p className="text-sm text-zinc-500">
                Choose a memorable name for your channel
              </p>
            </div>

            {/* Niche Selection */}
            <div className="space-y-2">
              <Label htmlFor="niche" className="text-zinc-200 text-base">
                Niche *
              </Label>
              <Select
                value={selectedNiche || undefined}
                onValueChange={(value) => setSelectedNiche(value as Niche)}
              >
                <SelectTrigger id="niche">
                  <SelectValue placeholder="Select your niche" />
                </SelectTrigger>
                <SelectContent>
                  {niches.map((niche) => (
                    <SelectItem key={niche.value} value={niche.value}>
                      {niche.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-zinc-500">
                What topic will your channel focus on?
              </p>
            </div>

            {/* Custom Niche (if 'other' is selected) */}
            {selectedNiche === 'other' && (
              <div className="space-y-2">
                <Label htmlFor="custom-niche" className="text-zinc-200 text-base">
                  Custom Niche
                </Label>
                <Input
                  id="custom-niche"
                  placeholder="Describe your niche"
                  value={customNiche}
                  onChange={(e) => setCustomNiche(e.target.value)}
                  className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                />
              </div>
            )}

            {/* Target Audience (Optional) */}
            <div className="space-y-2">
              <Label htmlFor="target-audience" className="text-zinc-200 text-base">
                Target Audience
                <span className="text-zinc-500 font-normal ml-2">(Optional)</span>
              </Label>
              <Textarea
                id="target-audience"
                placeholder="Describe your target audience (e.g., young professionals, gaming enthusiasts, fitness beginners)"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 min-h-[100px]"
              />
              <p className="text-sm text-zinc-500">
                Who are you creating content for?
              </p>
            </div>
          </div>

          <WizardNavigation
            nextHref="/wizard/content-strategy"
            onNext={handleNext}
            nextDisabled={!isValid}
          />
        </div>
      </Card>
    </WizardLayout>
  );
}
