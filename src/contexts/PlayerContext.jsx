import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getPlaybackState, playTrack as apiPlayTrack } from '../api';

const PlayerContext = createContext();

// Default seed tracks for Recently Played (shown on first load)
const DEFAULT_SEED_TRACKS = [
  {
    id: 'seed-1',
    uri: 'spotify:track:default1',
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    album: 'After Hours',
    albumArt: 'https://i.scdn.co/image/ab67616d0000b273ef6d8c82dfe9c5ac3ce56aa6'
  },
  {
    id: 'seed-2',
    uri: 'spotify:track:default2',
    title: 'Shape of You',
    artist: 'Ed Sheeran',
    album: '÷ (Deluxe)',
    albumArt: 'https://i.scdn.co/image/ab67616d0000b273ba5db46f4b838ef6027e6f96'
  },
  {
    id: 'seed-3',
    uri: 'spotify:track:default3',
    title: 'Levitating',
    artist: 'Dua Lipa',
    album: 'Future Nostalgia',
    albumArt: 'https://i.scdn.co/image/ab67616d0000b273d6d3e70609c5e4e653dbc8f2'
  },
  {
    id: 'seed-4',
    uri: 'spotify:track:default4',
    title: 'drivers license',
    artist: 'Olivia Rodrigo',
    album: 'SOUR',
    albumArt: 'https://i.scdn.co/image/ab67616d0000b273a91c10fe9472d9bd89802e5a'
  },
  {
    id: 'seed-5',
    uri: 'spotify:track:default5',
    title: 'As It Was',
    artist: 'Harry Styles',
    album: "Harry's House",
    albumArt: 'https://i.scdn.co/image/ab67616d0000b27344df4be6f26c7a96c87e36e0'
  }
];

export function PlayerProvider({ children }) {
  // Playback state
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  
  // Recently played with deduplication (max 20 unique tracks)
  const [recentlyPlayed, setRecentlyPlayed] = useState(() => {
    // Try to load from localStorage first
    const stored = localStorage.getItem('recentlyPlayed');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Failed to parse stored recently played:', e);
      }
    }
    // Return default seed tracks if nothing stored
    return DEFAULT_SEED_TRACKS;
  });

  // Search history (last 3-4 searches)
  const [searchHistory, setSearchHistory] = useState(() => {
    const stored = localStorage.getItem('searchHistory');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Failed to parse search history:', e);
      }
    }
    return [];
  });

  // Poll playback state
  useEffect(() => {
    async function fetchPlayback() {
      try {
        const state = await getPlaybackState();
        if (state?.item) {
          setCurrentTrack(state.item);
          setIsPlaying(state.is_playing);
          setProgress(state.progress_ms || 0);
          setDuration(state.item.duration_ms || 0);
        }
      } catch (err) {
        // Silently fail - user may not be authenticated
      }
    }

    fetchPlayback();
    const interval = setInterval(fetchPlayback, 1000); // Update every second for smooth progress
    return () => clearInterval(interval);
  }, []);

  // Save recently played to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('recentlyPlayed', JSON.stringify(recentlyPlayed));
  }, [recentlyPlayed]);

  // Save search history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
  }, [searchHistory]);

  // Add track to recently played with deduplication
  const addToRecentlyPlayed = useCallback((track) => {
    setRecentlyPlayed(prev => {
      // Remove if already exists (based on track ID)
      const filtered = prev.filter(t => t.id !== track.id);
      // Add to front
      const updated = [track, ...filtered];
      // Limit to 20 tracks
      return updated.slice(0, 20);
    });
  }, []);

  // Add search query to history
  const addToSearchHistory = useCallback((query) => {
    if (!query || query.trim().length === 0) return;
    
    const trimmedQuery = query.trim();
    setSearchHistory(prev => {
      // Remove if already exists
      const filtered = prev.filter(q => q !== trimmedQuery);
      // Add to front
      const updated = [trimmedQuery, ...filtered];
      // Limit to 4 queries
      return updated.slice(0, 4);
    });
  }, []);

  // Play track wrapper that updates recently played
  const playTrack = useCallback(async (trackUri, trackData) => {
    try {
      await apiPlayTrack(trackUri);
      
      // Add to recently played if track data provided
      if (trackData) {
        addToRecentlyPlayed(trackData);
      }
      
      return true;
    } catch (error) {
      console.error('Failed to play track:', error);
      throw error;
    }
  }, [addToRecentlyPlayed]);

  const value = {
    currentTrack,
    isPlaying,
    progress,
    duration,
    recentlyPlayed,
    searchHistory,
    addToRecentlyPlayed,
    addToSearchHistory,
    playTrack,
  };

  return (
    <PlayerContext.Provider value={value}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within PlayerProvider');
  }
  return context;
}
