'use client';

import { useState, useEffect, KeyboardEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useWizardStore, type ContentStyle, type Frequency } from '@/store/wizard-store';
import { useTranslation } from '@/lib/i18n';
import { WizardLayout } from '@/components/wizard/WizardLayout';
import { WizardNavigation } from '@/components/wizard/WizardNavigation';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { X } from 'lucide-react';

const contentStyles: { value: ContentStyle; label: string; description: string }[] = [
  {
    value: 'educational',
    label: 'Educational',
    description: 'Teach and inform your audience with valuable knowledge',
  },
  {
    value: 'entertaining',
    label: 'Entertaining',
    description: 'Create fun and engaging content that entertains',
  },
  {
    value: 'inspirational',
    label: 'Inspirational',
    description: 'Motivate and inspire your viewers',
  },
];

const frequencies: { value: Frequency; label: string; description: string }[] = [
  {
    value: 'daily',
    label: 'Daily',
    description: 'Upload content every day',
  },
  {
    value: '2-3x-week',
    label: '2-3x per Week',
    description: 'Upload 2-3 times per week',
  },
  {
    value: 'weekly',
    label: 'Weekly',
    description: 'Upload once per week',
  },
];

export default function ContentStrategyPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { strategy, setStrategy, setCurrentStep, canProceed } = useWizardStore();

  const [topics, setTopics] = useState<string[]>(strategy.topics);
  const [currentTopic, setCurrentTopic] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<ContentStyle | null>(strategy.style);
  const [selectedFrequency, setSelectedFrequency] = useState<Frequency | null>(
    strategy.frequency
  );

  // Set current step on mount
  useEffect(() => {
    setCurrentStep(2);
  }, [setCurrentStep]);

  // Update store when values change
  useEffect(() => {
    setStrategy({
      topics,
      style: selectedStyle,
      frequency: selectedFrequency,
    });
  }, [topics, selectedStyle, selectedFrequency, setStrategy]);

  const handleAddTopic = () => {
    const trimmedTopic = currentTopic.trim();
    if (trimmedTopic && !topics.includes(trimmedTopic)) {
      setTopics([...topics, trimmedTopic]);
      setCurrentTopic('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTopic();
    }
  };

  const handleRemoveTopic = (topicToRemove: string) => {
    setTopics(topics.filter((topic) => topic !== topicToRemove));
  };

  const handleNext = () => {
    if (canProceed(2)) {
      router.push('/wizard/platforms');
    }
  };

  const handleBack = () => {
    router.push('/wizard/channel-setup');
  };

  const isValid = canProceed(2);

  return (
    <WizardLayout step={2}>
      <Card className="bg-zinc-900 border-zinc-800 p-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Content Strategy</h1>
            <p className="text-zinc-400">
              Define your content topics, style, and posting frequency
            </p>
          </div>

          <div className="space-y-6">
            {/* Topics Input */}
            <div className="space-y-2">
              <Label htmlFor="topics" className="text-zinc-200 text-base">
                Content Topics *
              </Label>
              <div className="space-y-3">
                <Input
                  id="topics"
                  placeholder="Type a topic and press Enter"
                  value={currentTopic}
                  onChange={(e) => setCurrentTopic(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                />

                {/* Topic Tags/Chips */}
                {topics.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {topics.map((topic) => (
                      <div
                        key={topic}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-full text-sm text-white"
                      >
                        <span>{topic}</span>
                        <button
                          onClick={() => handleRemoveTopic(topic)}
                          className="hover:bg-white/10 rounded-full p-0.5 transition-colors"
                          aria-label={`Remove ${topic}`}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <p className="text-sm text-zinc-500">
                Add topics you want to create content about (press Enter to add)
              </p>
            </div>

            {/* Content Style */}
            <div className="space-y-3">
              <Label className="text-zinc-200 text-base">Content Style *</Label>
              <RadioGroup
                value={selectedStyle || undefined}
                onValueChange={(value) => setSelectedStyle(value as ContentStyle)}
                className="gap-3"
              >
                {contentStyles.map((style) => (
                  <div
                    key={style.value}
                    className={`relative flex items-start space-x-3 rounded-lg border p-4 cursor-pointer transition-colors ${
                      selectedStyle === style.value
                        ? 'border-purple-500 bg-purple-500/10'
                        : 'border-zinc-700 hover:border-zinc-600 bg-zinc-800/50'
                    }`}
                  >
                    <RadioGroupItem value={style.value} id={style.value} className="mt-1" />
                    <label
                      htmlFor={style.value}
                      className="flex-1 cursor-pointer"
                    >
                      <div className="font-medium text-white">{style.label}</div>
                      <div className="text-sm text-zinc-400 mt-1">
                        {style.description}
                      </div>
                    </label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Posting Frequency */}
            <div className="space-y-3">
              <Label className="text-zinc-200 text-base">Posting Frequency *</Label>
              <RadioGroup
                value={selectedFrequency || undefined}
                onValueChange={(value) => setSelectedFrequency(value as Frequency)}
                className="gap-3"
              >
                {frequencies.map((freq) => (
                  <div
                    key={freq.value}
                    className={`relative flex items-start space-x-3 rounded-lg border p-4 cursor-pointer transition-colors ${
                      selectedFrequency === freq.value
                        ? 'border-purple-500 bg-purple-500/10'
                        : 'border-zinc-700 hover:border-zinc-600 bg-zinc-800/50'
                    }`}
                  >
                    <RadioGroupItem value={freq.value} id={freq.value} className="mt-1" />
                    <label
                      htmlFor={freq.value}
                      className="flex-1 cursor-pointer"
                    >
                      <div className="font-medium text-white">{freq.label}</div>
                      <div className="text-sm text-zinc-400 mt-1">
                        {freq.description}
                      </div>
                    </label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>

          <WizardNavigation
            backHref="/wizard/channel-setup"
            onBack={handleBack}
            nextHref="/wizard/step-3"
            onNext={handleNext}
            nextDisabled={!isValid}
          />
        </div>
      </Card>
    </WizardLayout>
  );
}
