import { AudioSourceType, LicenseType } from '../types';
import { audioConfig } from '../config';

/**
 * Royal Free Music Source Adapter
 * Implements the AudioSource interface for Royal Free Music API
 * Provides royalty-free, fully playable music
 */
class RoyalFreeSource {
  constructor() {
    this.name = 'Royal Free Music';
    this.baseUrl = audioConfig.sources[AudioSourceType.ROYALFREE].baseUrl;
  }

  /**
   * Search for royalty-free music
   * @param {Object} params - Search parameters
   * @param {string} params.q - Search query
   * @param {number} [params.page] - Page number
   * @param {number} [params.pageSize] - Results per page
   * @returns {Promise<Array>} Normalized audio items
   */
  async search({ q, page = 1, pageSize = 20 }) {
    if (!q || !q.trim()) {
      return [];
    }

    try {
      // Royal Free Music API endpoints
      const params = new URLSearchParams({
        query: q.trim(),
        page: page.toString(),
        limit: pageSize.toString(),
      });

      const url = `${this.baseUrl}/search?${params.toString()}`;
      
      const response = await this._fetchWithRetry(url);
      
      if (!response.ok) {
        throw new Error(`Royal Free Music API error: ${response.status}`);
      }

      const data = await response.json();
      
      // Normalize results to common schema
      return this._normalizeResults(data.tracks || data.results || []);
    } catch (error) {
      console.error('Royal Free Music search error:', error);
      throw error;
    }
  }

  /**
   * Get audio item by ID
   * @param {string} id - Track ID
   * @returns {Promise<Object|null>} Normalized audio item or null
   */
  async getById(id) {
    try {
      const url = `${this.baseUrl}/track/${id}`;
      
      const response = await this._fetchWithRetry(url);
      
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`Royal Free Music API error: ${response.status}`);
      }

      const data = await response.json();
      
      // Normalize single result
      const normalized = this._normalizeResults([data]);
      return normalized[0] || null;
    } catch (error) {
      console.error('Royal Free Music getById error:', error);
      return null;
    }
  }

  /**
   * Normalize Royal Free Music API results to common schema
   * @private
   */
  _normalizeResults(results) {
    return results
      .filter(item => {
        // Only include items with a valid, playable audio URL
        return item.audio_url || item.stream_url || item.url;
      })
      .map(item => {
        return {
          id: item.id || item.track_id,
          title: item.title || item.name || 'Untitled',
          artist: item.artist || item.creator || 'Unknown Artist',
          license: LicenseType.OTHER, // Royal Free guarantees royalty-free but not necessarily PD/CC
          audioUrl: item.audio_url || item.stream_url || item.url,
          thumbnailUrl: item.thumbnail || item.artwork_url || item.image_url || undefined,
          source: AudioSourceType.ROYALFREE,
          duration: item.duration ? this._formatDuration(item.duration) : undefined,
          durationMs: item.duration_ms || (item.duration ? item.duration * 1000 : undefined),
        };
      });
  }

  /**
   * Format duration to MM:SS
   * @private
   */
  _formatDuration(duration) {
    // Duration might be in seconds or milliseconds
    const seconds = duration > 10000 ? Math.floor(duration / 1000) : duration;
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  /**
   * Fetch with retry logic
   * @private
   */
  async _fetchWithRetry(url, retries = audioConfig.search.maxRetries) {
    let lastError;
    
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url, {
          headers: {
            'Accept': 'application/json',
          },
        });
        
        return response;
      } catch (error) {
        lastError = error;
        
        // Don't retry on last attempt
        if (i < retries - 1) {
          // Exponential backoff
          const delay = audioConfig.search.retryDelayMs * Math.pow(2, i);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    throw lastError;
  }
}

export default RoyalFreeSource;
