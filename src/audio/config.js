import { AudioSourceType } from './types';

/**
 * Audio source configuration
 * Controls which source is active and behavior
 */
export const audioConfig = {
  // Default audio source (Openverse per requirements)
  defaultSource: AudioSourceType.OPENVERSE,
  
  // Enable/disable specific sources
  sources: {
    [AudioSourceType.OPENVERSE]: {
      enabled: true,
      baseUrl: 'https://api.openverse.org/v1',
    },
    [AudioSourceType.ROYALFREE]: {
      enabled: true,
      // Royal Free Music API - free, royalty-free music
      baseUrl: 'https://api.royalfreemusic.com/v1',
    },
    [AudioSourceType.SPOTIFY]: {
      // Disabled by default to avoid licensing issues
      enabled: false,
      // Uses existing Spotify API configuration from api.js
    },
  },
  
  // Cache configuration
  cache: {
    enabled: true,
    ttl: 5 * 60 * 1000, // 5 minutes
    maxSize: 100, // Max number of cached queries
  },
  
  // Search configuration
  search: {
    debounceMs: 300,
    defaultPageSize: 20,
    maxRetries: 3,
    retryDelayMs: 1000,
  },
};

/**
 * Get current active source
 */
export function getActiveSource() {
  const stored = localStorage.getItem('audio_source');
  if (stored && audioConfig.sources[stored]?.enabled) {
    return stored;
  }
  return audioConfig.defaultSource;
}

/**
 * Set active source
 */
export function setActiveSource(source) {
  if (!audioConfig.sources[source]?.enabled) {
    throw new Error(`Audio source ${source} is not enabled`);
  }
  localStorage.setItem('audio_source', source);
}

/**
 * Check if a source is enabled
 */
export function isSourceEnabled(source) {
  return audioConfig.sources[source]?.enabled ?? false;
}
