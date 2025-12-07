import { AudioSourceType, LicenseType } from '../types';
import { audioConfig } from '../config';

/**
 * Openverse Audio Source Adapter
 * Implements the AudioSource interface for Openverse API
 * https://api.openverse.org/v1/audio/
 */
class OpenverseSource {
  constructor() {
    this.name = 'Openverse';
    this.baseUrl = audioConfig.sources[AudioSourceType.OPENVERSE].baseUrl;
  }

  /**
   * Search for audio on Openverse
   * @param {Object} params - Search parameters
   * @param {string} params.q - Search query
   * @param {string[]} [params.license] - License filters
   * @param {number} [params.page] - Page number
   * @param {number} [params.pageSize] - Results per page
   * @returns {Promise<Array>} Normalized audio items
   */
  async search({ q, license = ['pd', 'cc'], page = 1, pageSize = 20 }) {
    if (!q || !q.trim()) {
      return [];
    }

    try {
      // Build query parameters per Openverse API docs
      const params = new URLSearchParams({
        q: q.trim(),
        page: page.toString(),
        page_size: pageSize.toString(),
      });

      // Add license filters
      // Openverse accepts: pd, cc-by, cc-by-sa, cc-by-nd, cc-by-nc, cc-by-nc-sa, cc-by-nc-nd, cc0
      if (license && license.length > 0) {
        // Map generic 'pd' and 'cc' to specific Openverse licenses
        const openversionLicenses = this._expandLicenses(license);
        params.append('license', openversionLicenses.join(','));
      }

      const url = `${this.baseUrl}/audio/?${params.toString()}`;
      
      const response = await this._fetchWithRetry(url);
      
      if (!response.ok) {
        throw new Error(`Openverse API error: ${response.status}`);
      }

      const data = await response.json();
      
      // Normalize results to common schema
      return this._normalizeResults(data.results || []);
    } catch (error) {
      console.error('Openverse search error:', error);
      throw error;
    }
  }

  /**
   * Get audio item by ID from Openverse
   * @param {string} id - Openverse audio ID
   * @returns {Promise<Object|null>} Normalized audio item or null
   */
  async getById(id) {
    try {
      const url = `${this.baseUrl}/audio/${id}/`;
      
      const response = await this._fetchWithRetry(url);
      
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`Openverse API error: ${response.status}`);
      }

      const data = await response.json();
      
      // Normalize single result
      const normalized = this._normalizeResults([data]);
      return normalized[0] || null;
    } catch (error) {
      console.error('Openverse getById error:', error);
      return null;
    }
  }

  /**
   * Expand generic license codes to specific Openverse licenses
   * @private
   */
  _expandLicenses(licenses) {
    const expanded = [];
    
    licenses.forEach(license => {
      const lower = license.toLowerCase();
      if (lower === 'pd') {
        // Public domain licenses
        expanded.push('cc0', 'pdm');
      } else if (lower === 'cc') {
        // Creative Commons licenses
        expanded.push('cc-by', 'cc-by-sa', 'cc-by-nd', 'cc-by-nc', 'cc-by-nc-sa', 'cc-by-nc-nd');
      } else {
        // Use as-is for specific licenses
        expanded.push(license);
      }
    });
    
    return [...new Set(expanded)]; // Remove duplicates
  }

  /**
   * Normalize Openverse API results to common schema
   * @private
   */
  _normalizeResults(results) {
    return results
      .filter(item => {
        // Only include items with a valid audio URL
        return item.url || item.audio_url;
      })
      .map(item => {
        // Determine license type
        let license = LicenseType.OTHER;
        const itemLicense = (item.license || '').toLowerCase();
        
        if (itemLicense === 'cc0' || itemLicense === 'pdm' || itemLicense.includes('public')) {
          license = LicenseType.PUBLIC_DOMAIN;
        } else if (itemLicense.startsWith('cc-') || itemLicense.startsWith('cc ')) {
          license = LicenseType.CREATIVE_COMMONS;
        }

        return {
          id: item.id,
          title: item.title || 'Untitled',
          artist: item.creator || item.creator_url || 'Unknown Artist',
          license: license,
          audioUrl: item.url || item.audio_url,
          thumbnailUrl: item.thumbnail || undefined,
          source: AudioSourceType.OPENVERSE,
          duration: item.duration ? this._formatDuration(item.duration) : undefined,
          durationMs: item.duration ? item.duration * 1000 : undefined,
        };
      });
  }

  /**
   * Format duration in seconds to MM:SS
   * @private
   */
  _formatDuration(seconds) {
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

export default OpenverseSource;
