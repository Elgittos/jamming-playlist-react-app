import { AudioSourceType, LicenseType } from '../types';
import { searchSpotify, isAuthenticated } from '../../api';

/**
 * Spotify Source Adapter
 * Implements the AudioSource interface for Spotify API
 * Filters out non-playable tracks to avoid UI breakage
 * Disabled by default (see config.js)
 */
class SpotifySource {
  constructor() {
    this.name = 'Spotify';
  }

  /**
   * Search for tracks on Spotify
   * @param {Object} params - Search parameters
   * @param {string} params.q - Search query
   * @param {number} [params.pageSize] - Results per page
   * @returns {Promise<Array>} Normalized audio items
   */
  async search({ q, pageSize = 20 }) {
    if (!q || !q.trim()) {
      return [];
    }

    // Check authentication
    if (!isAuthenticated()) {
      throw new Error('Spotify authentication required');
    }

    try {
      // Use existing Spotify API
      // Note: Spotify API doesn't support pagination by page number,
      // it uses offset/limit instead
      // For now, we'll just use the limit and ignore pagination
      // TODO: Implement proper offset-based pagination when needed
      
      const data = await searchSpotify(q, pageSize);
      
      // Normalize and filter results
      const tracks = data.tracks?.items || [];
      return this._normalizeResults(tracks);
    } catch (error) {
      console.error('Spotify search error:', error);
      throw error;
    }
  }

  /**
   * Get audio item by ID from Spotify
   * Note: This requires a separate API call not implemented in api.js
   * Returns null for now to avoid breaking UI
   * @returns {Promise<Object|null>} Normalized audio item or null
   */
  async getById() {
    console.warn('SpotifySource.getById not fully implemented - track details API needed');
    return null;
  }

  /**
   * Normalize Spotify API results to common schema
   * Filters out non-playable tracks
   * @private
   */
  _normalizeResults(tracks) {
    return tracks
      .filter(track => {
        // Filter out non-playable tracks to avoid UI breakage
        // A track is playable if it has a URI and is not explicitly marked as unplayable
        return (
          track.uri &&
          track.is_playable !== false &&
          !track.restrictions
        );
      })
      .map(track => {
        return {
          id: track.id,
          title: track.name,
          artist: track.artists?.map(a => a.name).join(', ') || 'Unknown Artist',
          license: LicenseType.OTHER, // Spotify content is not open-licensed
          audioUrl: '', // Spotify doesn't provide direct audio URLs, uses URI system
          thumbnailUrl: track.album?.images?.[0]?.url || undefined,
          source: AudioSourceType.SPOTIFY,
          duration: this._formatDuration(track.duration_ms),
          durationMs: track.duration_ms,
          uri: track.uri, // Spotify-specific URI for playback
        };
      });
  }

  /**
   * Format duration in milliseconds to MM:SS
   * @private
   */
  _formatDuration(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
}

export default SpotifySource;
