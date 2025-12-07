import { useState, useCallback, useRef } from 'react';
import { AudioContext } from './context';
import { audioConfig, getActiveSource, setActiveSource } from './config';
import { AudioSourceType } from './types';
import OpenverseSource from './sources/OpenverseSource';
import RoyalFreeSource from './sources/RoyalFreeSource';
import SpotifySource from './sources/SpotifySource';

/**
 * Audio Provider Component
 * Manages audio sources, search, and caching
 */
export function AudioProvider({ children }) {
  // Initialize source instances
  const sources = useRef({
    [AudioSourceType.OPENVERSE]: new OpenverseSource(),
    [AudioSourceType.ROYALFREE]: new RoyalFreeSource(),
    [AudioSourceType.SPOTIFY]: new SpotifySource(),
  });

  // Current active source
  const [currentSource, setCurrentSource] = useState(getActiveSource());

  // Cache for search results
  const cache = useRef(new Map());

  // Active requests for cancellation
  const activeRequests = useRef(new Map());

  /**
   * Switch audio source
   */
  const switchSource = useCallback((sourceType) => {
    try {
      setActiveSource(sourceType);
      setCurrentSource(sourceType);
      return true;
    } catch (error) {
      console.error('Failed to switch source:', error);
      return false;
    }
  }, []);

  /**
   * Get current source instance
   */
  const getCurrentSourceInstance = useCallback(() => {
    return sources.current[currentSource];
  }, [currentSource]);

  /**
   * Generate cache key
   */
  const getCacheKey = useCallback((sourceType, method, params) => {
    return `${sourceType}:${method}:${JSON.stringify(params)}`;
  }, []);

  /**
   * Get from cache
   */
  const getFromCache = useCallback((key) => {
    if (!audioConfig.cache.enabled) {
      return null;
    }

    const cached = cache.current.get(key);
    if (!cached) {
      return null;
    }

    // Check if cache entry is still valid
    const now = Date.now();
    if (now - cached.timestamp > audioConfig.cache.ttl) {
      cache.current.delete(key);
      return null;
    }

    return cached.data;
  }, []);

  /**
   * Save to cache
   */
  const saveToCache = useCallback((key, data) => {
    if (!audioConfig.cache.enabled) {
      return;
    }

    // Implement LRU-like behavior: if cache is full, remove oldest entry
    if (cache.current.size >= audioConfig.cache.maxSize) {
      const firstKey = cache.current.keys().next().value;
      cache.current.delete(firstKey);
    }

    cache.current.set(key, {
      data,
      timestamp: Date.now(),
    });
  }, []);

  /**
   * Search audio with caching and cancellation
   */
  const search = useCallback(async (params) => {
    const sourceInstance = getCurrentSourceInstance();
    const cacheKey = getCacheKey(currentSource, 'search', params);

    // Check cache first
    const cached = getFromCache(cacheKey);
    if (cached) {
      return cached;
    }

    // Cancel any previous request with same key
    const existingController = activeRequests.current.get(cacheKey);
    if (existingController) {
      existingController.abort();
    }

    // Create new abort controller
    const controller = new AbortController();
    activeRequests.current.set(cacheKey, controller);

    try {
      const results = await sourceInstance.search(params);
      
      // Save to cache
      saveToCache(cacheKey, results);
      
      return results;
    } catch (error) {
      // Don't throw on abort
      if (error.name === 'AbortError') {
        return [];
      }
      throw error;
    } finally {
      activeRequests.current.delete(cacheKey);
    }
  }, [currentSource, getCurrentSourceInstance, getCacheKey, getFromCache, saveToCache]);

  /**
   * Get audio by ID with caching
   */
  const getById = useCallback(async (id) => {
    const sourceInstance = getCurrentSourceInstance();
    const cacheKey = getCacheKey(currentSource, 'getById', { id });

    // Check cache first
    const cached = getFromCache(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const result = await sourceInstance.getById(id);
      
      // Save to cache
      if (result) {
        saveToCache(cacheKey, result);
      }
      
      return result;
    } catch (error) {
      console.error('Get by ID error:', error);
      return null;
    }
  }, [currentSource, getCurrentSourceInstance, getCacheKey, getFromCache, saveToCache]);

  /**
   * Clear cache
   */
  const clearCache = useCallback(() => {
    cache.current.clear();
  }, []);

  const value = {
    currentSource,
    switchSource,
    search,
    getById,
    clearCache,
    sources: Object.keys(sources.current).filter(key => audioConfig.sources[key]?.enabled),
  };

  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  );
}
