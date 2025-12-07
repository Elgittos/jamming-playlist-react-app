import { useState, useCallback, useRef, useEffect, useContext } from 'react';
import { AudioContext } from './context';
import { audioConfig } from './config';
import { AudioSourceType } from './types';

/**
 * Hook to use audio context
 */
export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within AudioProvider');
  }
  return context;
}

/**
 * Hook for audio search with debouncing
 */
export function useAudioSearch() {
  const { search, currentSource } = useAudio();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const debounceTimer = useRef(null);

  const searchAudio = useCallback((query, options = {}) => {
    // Clear previous debounce timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Reset error
    setError(null);

    // If query is empty, clear results immediately
    if (!query || !query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    // Set loading
    setLoading(true);

    // Debounce search
    debounceTimer.current = setTimeout(async () => {
      try {
        const searchResults = await search({
          q: query,
          ...options,
        });
        setResults(searchResults);
        setError(null);
      } catch (err) {
        console.error('Search error:', err);
        setError(err.message || 'Search failed');
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, audioConfig.search.debounceMs);
  }, [search]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  return {
    results,
    loading,
    error,
    searchAudio,
    currentSource,
  };
}

/**
 * Hook for audio player functionality
 */
export function useAudioPlayer() {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const play = useCallback((track) => {
    if (!track) return;

    // If it's a Spotify track with URI, use existing Spotify playback
    if (track.source === AudioSourceType.SPOTIFY && track.uri) {
      // Use existing Spotify playback from api.js
      import('../api').then(({ playTrack }) => {
        playTrack(track.uri)
          .then(() => {
            setCurrentTrack(track);
            setIsPlaying(true);
          })
          .catch(err => {
            console.error('Spotify playback error:', err);
          });
      });
      return;
    }

    // For Openverse and RoyalFree, use HTML5 audio
    if (track.audioUrl) {
      if (!audioRef.current) {
        audioRef.current = new Audio();
      }

      audioRef.current.src = track.audioUrl;
      audioRef.current.play()
        .then(() => {
          setCurrentTrack(track);
          setIsPlaying(true);
        })
        .catch(err => {
          console.error('Audio playback error:', err);
        });
    }
  }, []);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  const resume = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(err => console.error('Resume error:', err));
    }
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  }, []);

  return {
    currentTrack,
    isPlaying,
    play,
    pause,
    resume,
    stop,
  };
}
