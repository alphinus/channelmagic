/**
 * Example usage of ChannelMagic API Services
 *
 * This file demonstrates how to use the OpenRouter and HeyGen services.
 * Note: This is for documentation purposes. Actual tests should use proper test frameworks.
 */

import {
  generateScript,
  validateOpenRouterKey,
  type ScriptGenerationParams,
} from '../openrouter';

import {
  createVideo,
  getVideoStatus,
  getRemainingQuota,
  validateHeyGenKey,
  type HeyGenVideoParams,
} from '../heygen';

// Example 1: Validate OpenRouter API Key
async function exampleValidateOpenRouter(apiKey: string) {
  const isValid = await validateOpenRouterKey(apiKey);
  console.log('OpenRouter key valid:', isValid);
  return isValid;
}

// Example 2: Generate a script
async function exampleGenerateScript(apiKey: string) {
  const params: ScriptGenerationParams = {
    topic: 'Die Zukunft der künstlichen Intelligenz',
    style: 'educational',
    duration: 'short',
    platform: 'youtube',
    locale: 'de',
    niche: 'Technology',
    targetAudience: 'Tech-interessierte zwischen 18-35',
  };

  const script = await generateScript(apiKey, params);
  console.log('Generated script:', script);
  return script;
}

// Example 3: Validate HeyGen API Key
async function exampleValidateHeyGen(apiKey: string) {
  const isValid = await validateHeyGenKey(apiKey);
  console.log('HeyGen key valid:', isValid);
  return isValid;
}

// Example 4: Check HeyGen quota
async function exampleCheckQuota(apiKey: string) {
  const quota = await getRemainingQuota(apiKey);
  console.log('Remaining HeyGen quota:', quota);
  return quota;
}

// Example 5: Create a video
async function exampleCreateVideo(apiKey: string, script: string) {
  const params: HeyGenVideoParams = {
    script,
    avatarId: 'default',
    voiceId: 'default',
    backgroundColor: '#000000',
  };

  const videoId = await createVideo(apiKey, params);
  console.log('Video ID:', videoId);
  return videoId;
}

// Example 6: Check video status
async function exampleCheckVideoStatus(apiKey: string, videoId: string) {
  const status = await getVideoStatus(apiKey, videoId);
  console.log('Video status:', status);
  return status;
}

// Example 7: Complete workflow
async function exampleCompleteWorkflow(
  openRouterKey: string,
  heyGenKey: string
) {
  // Step 1: Validate API keys
  console.log('Step 1: Validating API keys...');
  const openRouterValid = await validateOpenRouterKey(openRouterKey);
  const heyGenValid = await validateHeyGenKey(heyGenKey);

  if (!openRouterValid || !heyGenValid) {
    throw new Error('Invalid API keys');
  }

  // Step 2: Check HeyGen quota
  console.log('Step 2: Checking HeyGen quota...');
  const quota = await getRemainingQuota(heyGenKey);
  if (quota <= 0) {
    throw new Error('Insufficient HeyGen quota');
  }

  // Step 3: Generate script
  console.log('Step 3: Generating script...');
  const script = await generateScript(openRouterKey, {
    topic: 'Produktivitäts-Hacks für 2025',
    style: 'entertaining',
    duration: 'short',
    platform: 'tiktok',
    locale: 'de',
  });

  // Step 4: Create video
  console.log('Step 4: Creating video...');
  const videoId = await createVideo(heyGenKey, {
    script,
  });

  // Step 5: Poll for video completion
  console.log('Step 5: Waiting for video completion...');
  let status = await getVideoStatus(heyGenKey, videoId);

  while (status.status === 'pending' || status.status === 'processing') {
    await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait 5 seconds
    status = await getVideoStatus(heyGenKey, videoId);
    console.log('Current status:', status.status);
  }

  if (status.status === 'completed') {
    console.log('Video completed!', status.video_url);
    return status.video_url;
  } else {
    throw new Error(`Video generation failed: ${status.error}`);
  }
}

export {
  exampleValidateOpenRouter,
  exampleGenerateScript,
  exampleValidateHeyGen,
  exampleCheckQuota,
  exampleCreateVideo,
  exampleCheckVideoStatus,
  exampleCompleteWorkflow,
};
