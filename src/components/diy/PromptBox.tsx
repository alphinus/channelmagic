'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PromptBoxProps {
  prompt: string;
  title?: string;
  personalization?: {
    topic?: string;
    niche?: string;
    style?: string;
  };
}

export function PromptBox({ prompt, title, personalization }: PromptBoxProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Highlight personalized variables in the prompt
  const highlightedPrompt = () => {
    let highlighted = prompt;

    if (personalization?.topic) {
      highlighted = highlighted.replace(
        new RegExp(personalization.topic, 'g'),
        `<span class="text-purple-400 font-semibold">${personalization.topic}</span>`
      );
    }

    if (personalization?.niche) {
      highlighted = highlighted.replace(
        new RegExp(personalization.niche, 'gi'),
        `<span class="text-purple-400 font-semibold">${personalization.niche}</span>`
      );
    }

    if (personalization?.style) {
      highlighted = highlighted.replace(
        new RegExp(personalization.style, 'gi'),
        `<span class="text-purple-400 font-semibold">${personalization.style}</span>`
      );
    }

    return highlighted;
  };

  return (
    <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-6">
      {title && (
        <h3 className="text-lg font-semibold mb-3 text-white">{title}</h3>
      )}

      <div className="bg-zinc-900 rounded-lg p-4 mb-4 overflow-x-auto">
        <pre className="font-mono text-sm text-zinc-300 whitespace-pre-wrap">
          <code
            dangerouslySetInnerHTML={{ __html: highlightedPrompt() }}
          />
        </pre>
      </div>

      <Button
        onClick={handleCopy}
        className="w-full bg-green-600 hover:bg-green-700 transition-colors"
      >
        {copied ? (
          <>
            <Check className="w-4 h-4 mr-2" />
            Kopiert!
          </>
        ) : (
          <>
            <Copy className="w-4 h-4 mr-2" />
            Prompt kopieren
          </>
        )}
      </Button>
    </div>
  );
}
