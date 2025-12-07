/**
 * Normalized audio item schema
 * All audio sources must conform to this structure
 * @typedef {Object} NormalizedAudioItem
 * @property {string} id - Unique identifier for the audio item
 * @property {string} title - Track/audio title
 * @property {string} artist - Artist/creator name
 * @property {'PD' | 'CC' | 'Other'} license - License type (Public Domain, Creative Commons, or Other)
 * @property {string} audioUrl - Direct playable audio URL
 * @property {string} [thumbnailUrl] - Optional thumbnail/album art URL
 * @property {'openverse' | 'royalfree' | 'spotify'} source - Source of the audio
 * @property {string} [duration] - Optional duration in human-readable format
 * @property {number} [durationMs] - Optional duration in milliseconds
 * @property {string} [uri] - Optional source-specific URI (e.g., spotify:track:...)
 */

/**
 * Search parameters for audio sources
 * @typedef {Object} AudioSearchParams
 * @property {string} q - Search query/keywords
 * @property {string[]} [license] - License filters (e.g., ['pd', 'cc'])
 * @property {number} [page] - Page number for pagination
 * @property {number} [pageSize] - Number of results per page
 * @property {string} [sort] - Sort order
 */

/**
 * Audio source interface
 * All audio source adapters must implement these methods
 * @typedef {Object} AudioSource
 * @property {string} name - Name of the audio source
 * @property {function(AudioSearchParams): Promise<NormalizedAudioItem[]>} search - Search for audio items
 * @property {function(string): Promise<NormalizedAudioItem|null>} getById - Get audio item by ID
 */

/**
 * Audio source types
 */
export const AudioSourceType = {
  OPENVERSE: 'openverse',
  ROYALFREE: 'royalfree',
  SPOTIFY: 'spotify',
};

/**
 * License types
 */
export const LicenseType = {
  PUBLIC_DOMAIN: 'PD',
  CREATIVE_COMMONS: 'CC',
  OTHER: 'Other',
};

/**
 * Default search parameters
 */
export const DEFAULT_SEARCH_PARAMS = {
  page: 1,
  pageSize: 20,
  license: ['pd', 'cc'],
};
