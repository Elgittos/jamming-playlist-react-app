import { AudioSourceType, LicenseType } from '../types';
import { audioConfig } from '../config';

/**
 * Jamendo Music Source Adapter (using Royal Free name)
 * Implements the AudioSource interface for Jamendo API
 * Provides royalty-free, Creative Commons licensed music
 * API Docs: https://developer.jamendo.com/v3.0
 */
class RoyalFreeSource {
  constructor() {
    this.name = 'Jamendo Music';
    this.baseUrl = audioConfig.sources[AudioSourceType.ROYALFREE].baseUrl;
    this.clientId = audioConfig.sources[AudioSourceType.ROYALFREE].clientId;
  }

  /**
   * Search for royalty-free music on Jamendo
   * @param {Object} params - Search parameters
   * @param {string} params.q - Search query
   * @param {number} [params.page] - Page number (Jamendo uses offset)
   * @param {number} [params.pageSize] - Results per page
   * @returns {Promise<Array>} Normalized audio items
   */
  async search({ q, page = 1, pageSize = 20 }) {
    if (!q || !q.trim()) {
      return [];
    }

    try {
      // Jamendo API uses offset instead of page
      const offset = (page - 1) * pageSize;
      
      // Jamendo tracks search endpoint
      const params = new URLSearchParams({
        client_id: this.clientId,
        format: 'json',
        limit: pageSize.toString(),
        offset: offset.toString(),
        search: q.trim(),
        include: 'musicinfo',
        imagesize: '200',
      });

      const url = `${this.baseUrl}/tracks/?${params.toString()}`;
      
      const response = await this._fetchWithRetry(url);
      
      if (!response.ok) {
        throw new Error(`Jamendo API error: ${response.status}`);
      }

      const data = await response.json();
      
      // Normalize results to common schema
      return this._normalizeResults(data.results || []);
    } catch (error) {
      console.error('Jamendo search error:', error);
      throw error;
    }
  }

  /**
   * Get audio item by ID from Jamendo
   * @param {string} id - Track ID
   * @returns {Promise<Object|null>} Normalized audio item or null
   */
  async getById(id) {
    try {
      const params = new URLSearchParams({
        client_id: this.clientId,
        format: 'json',
        id: id,
        include: 'musicinfo',
        imagesize: '200',
      });
      
      const url = `${this.baseUrl}/tracks/?${params.toString()}`;
      
      const response = await this._fetchWithRetry(url);
      
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`Jamendo API error: ${response.status}`);
      }

      const data = await response.json();
      
      // Normalize single result
      const normalized = this._normalizeResults(data.results || []);
      return normalized[0] || null;
    } catch (error) {
      console.error('Jamendo getById error:', error);
      return null;
    }
  }

  /**
   * Normalize Jamendo API results to common schema
   * @private
   */
  _normalizeResults(results) {
    return results
      .filter(item => {
        // Only include items with a valid, playable audio URL
        return item.audio || item.audiodownload;
      })
      .map(item => {
        return {
          id: item.id,
          title: item.name || 'Untitled',
          artist: item.artist_name || 'Unknown Artist',
          license: LicenseType.CREATIVE_COMMONS, // Jamendo is all CC licensed
          audioUrl: item.audio || item.audiodownload,
          thumbnailUrl: item.image || item.album_image || undefined,
          source: AudioSourceType.ROYALFREE,
          duration: item.duration ? this._formatDuration(item.duration) : undefined,
          durationMs: item.duration ? item.duration * 1000 : undefined,
        };
      });
  }

  /**
   * Format duration to MM:SS
   * @private
   */
  _formatDuration(duration) {
    // Duration from Jamendo is in seconds
    const seconds = Math.floor(duration);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
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
