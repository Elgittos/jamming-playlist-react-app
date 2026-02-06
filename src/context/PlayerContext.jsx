import { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  getPlaybackState,
  getRecentlyPlayed,
  isAuthenticated,
  pausePlayback,
  playTrack as apiPlayTrack,
  resumePlayback,
  seekPlayback,
  skipToNext,
  skipToPrevious
} from '../api';

const RECENTLY_PLAYED_STORAGE_KEY = 'jp_recently_played_v1';
const SEARCH_HISTORY_STORAGE_KEY = 'jp_search_history_v1';

export const PlayerContext = createContext(null);

function clampNumber(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function normalizeSearchQuery(query) {
  return query.trim().replace(/\s+/g, ' ');
}

function formatTrackFromPlaybackItem(item) {
  if (!item) return null;
  return {
    id: item.id,
    uri: item.uri,
    title: item.name,
    artist: item.artists?.map((a) => a.name).join(', ') || '',
    album: item.album?.name || '',
    albumArt: item.album?.images?.[0]?.url || 'https://via.placeholder.com/200/0E7490/FFFFFF?text=No+Image'
  };
}

function formatTrackFromRecentlyPlayedItem(item, indexFallback) {
  const track = item?.track;
  if (!track) return null;
  return {
    id: track.id || indexFallback,
    uri: track.uri,
    title: track.name,
    artist: track.artists?.map((a) => a.name).join(', ') || '',
    album: track.album?.name || '',
    albumArt: track.album?.images?.[0]?.url || 'https://via.placeholder.com/200/0E7490/FFFFFF?text=No+Image'
  };
}

function dedupeAndCapRecentlyPlayed(tracks, maxItems = 20) {
  const seen = new Set();
  const result = [];
  for (const track of tracks) {
    if (!track?.id) continue;
    if (seen.has(track.id)) continue;
    seen.add(track.id);
    result.push(track);
    if (result.length >= maxItems) break;
  }
  return result;
}

export function PlayerProvider({ children }) {
  const [playbackState, setPlaybackState] = useState(null);
  const [isPlaybackLoading, setIsPlaybackLoading] = useState(true);

  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const [isRecentlyPlayedSeeded, setIsRecentlyPlayedSeeded] = useState(false);

  const [searchHistory, setSearchHistory] = useState([]);

  const lastTrackIdRef = useRef(null);
  const pollTimerRef = useRef(null);

  const isAuthed = isAuthenticated();

  const currentTrack = playbackState?.item ? formatTrackFromPlaybackItem(playbackState.item) : null;
  const isPlaying = Boolean(playbackState?.is_playing);
  const progressMs = playbackState?.progress_ms ?? 0;
  const durationMs = playbackState?.item?.duration_ms ?? 0;

  const upsertRecentlyPlayed = useCallback((track) => {
    if (!track?.id) return;
    setRecentlyPlayed((prev) => {
      const next = [track, ...prev.filter((t) => t?.id !== track.id)];
      const capped = next.slice(0, 20);
      try {
        localStorage.setItem(RECENTLY_PLAYED_STORAGE_KEY, JSON.stringify(capped));
      } catch {
        // ignore storage errors
      }
      return capped;
    });
  }, []);

  const seedRecentlyPlayed = useCallback(async () => {
    // 1) Try localStorage first (fast, works before any API)
    try {
      const raw = localStorage.getItem(RECENTLY_PLAYED_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setRecentlyPlayed(dedupeAndCapRecentlyPlayed(parsed, 20));
          setIsRecentlyPlayedSeeded(true);
          return;
        }
      }
    } catch {
      // ignore
    }

    // 2) If authenticated, seed from Spotify's recently-played endpoint
    if (!isAuthenticated()) {
      setRecentlyPlayed([]);
      setIsRecentlyPlayedSeeded(true);
      return;
    }

    try {
      const items = await getRecentlyPlayed(20);
      const formatted = items
        .map((item, index) => formatTrackFromRecentlyPlayedItem(item, index))
        .filter(Boolean);
      const seeded = dedupeAndCapRecentlyPlayed(formatted, 20);
      setRecentlyPlayed(seeded);
      try {
        localStorage.setItem(RECENTLY_PLAYED_STORAGE_KEY, JSON.stringify(seeded));
      } catch {
        // ignore
      }
    } catch {
      setRecentlyPlayed([]);
    } finally {
      setIsRecentlyPlayedSeeded(true);
    }
  }, []);

  const loadSearchHistory = useCallback(() => {
    try {
      const raw = localStorage.getItem(SEARCH_HISTORY_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        setSearchHistory(parsed.slice(0, 4));
      }
    } catch {
      // ignore
    }
  }, []);

  const addSearchQuery = useCallback((query) => {
    const normalized = normalizeSearchQuery(query);
    if (!normalized) return;
    setSearchHistory((prev) => {
      const next = [normalized, ...prev.filter((q) => q.toLowerCase() !== normalized.toLowerCase())].slice(0, 4);
      try {
        localStorage.setItem(SEARCH_HISTORY_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  const refreshPlaybackState = useCallback(async () => {
    if (!isAuthenticated()) {
      setPlaybackState(null);
      setIsPlaybackLoading(false);
      return;
    }

    try {
      const state = await getPlaybackState();
      setPlaybackState(state);

      const trackId = state?.item?.id ?? null;
      if (trackId && trackId !== lastTrackIdRef.current) {
        lastTrackIdRef.current = trackId;
        const track = formatTrackFromPlaybackItem(state.item);
        upsertRecentlyPlayed(track);
      }
    } catch {
      // Keep last known state; avoid spamming errors in UI
    } finally {
      setIsPlaybackLoading(false);
    }
  }, [upsertRecentlyPlayed]);

  useEffect(() => {
    loadSearchHistory();
    seedRecentlyPlayed();
  }, [loadSearchHistory, seedRecentlyPlayed]);

  useEffect(() => {
    // Playback polling
    refreshPlaybackState();

    pollTimerRef.current = window.setInterval(refreshPlaybackState, 2000);
    return () => {
      if (pollTimerRef.current) {
        clearInterval(pollTimerRef.current);
        pollTimerRef.current = null;
      }
    };
  }, [refreshPlaybackState]);

  const playTrack = useCallback(
    async (uriOrUris, trackForRecentlyPlayed = null) => {
      const uris = Array.isArray(uriOrUris) ? uriOrUris : [uriOrUris];
      const firstUri = uris[0];
      if (!firstUri) return;

      await apiPlayTrack(uriOrUris);

      if (trackForRecentlyPlayed) {
        upsertRecentlyPlayed(trackForRecentlyPlayed);
      }

      // Optimistically refresh soon so UI updates quickly
      window.setTimeout(() => {
        refreshPlaybackState();
      }, 250);
    },
    [refreshPlaybackState, upsertRecentlyPlayed]
  );

  const togglePlayPause = useCallback(async () => {
    if (!isAuthenticated()) return;

    if (isPlaying) {
      await pausePlayback();
    } else {
      await resumePlayback();
    }

    window.setTimeout(() => {
      refreshPlaybackState();
    }, 200);
  }, [isPlaying, refreshPlaybackState]);

  const next = useCallback(async () => {
    if (!isAuthenticated()) return;
    await skipToNext();
    window.setTimeout(() => {
      refreshPlaybackState();
    }, 350);
  }, [refreshPlaybackState]);

  const previous = useCallback(async () => {
    if (!isAuthenticated()) return;
    await skipToPrevious();
    window.setTimeout(() => {
      refreshPlaybackState();
    }, 350);
  }, [refreshPlaybackState]);

  const seekToMs = useCallback(
    async (positionMs, { resume = true } = {}) => {
      if (!isAuthenticated()) return;
      const safeDuration = durationMs || 0;
      const clamped = safeDuration ? clampNumber(positionMs, 0, safeDuration) : Math.max(0, positionMs);

      await seekPlayback(clamped);
      if (resume) {
        await resumePlayback();
      }

      // Update UI quickly
      setPlaybackState((prev) => {
        if (!prev) return prev;
        return { ...prev, progress_ms: clamped };
      });

      window.setTimeout(() => {
        refreshPlaybackState();
      }, 250);
    },
    [durationMs, refreshPlaybackState]
  );

  const value = useMemo(
    () => ({
      isAuthed,
      playbackState,
      isPlaybackLoading,
      currentTrack,
      isPlaying,
      progressMs,
      durationMs,
      recentlyPlayed,
      isRecentlyPlayedSeeded,
      upsertRecentlyPlayed,
      playTrack,
      togglePlayPause,
      next,
      previous,
      seekToMs,
      searchHistory,
      addSearchQuery
    }),
    [
      isAuthed,
      playbackState,
      isPlaybackLoading,
      currentTrack,
      isPlaying,
      progressMs,
      durationMs,
      recentlyPlayed,
      isRecentlyPlayedSeeded,
      upsertRecentlyPlayed,
      playTrack,
      togglePlayPause,
      next,
      previous,
      seekToMs,
      searchHistory,
      addSearchQuery
    ]
  );

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}


