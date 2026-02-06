import { useState, useEffect, useMemo, useRef } from 'react';
import { searchSpotify, isAuthenticated } from '../api';
import { usePlayer } from '../hooks/usePlayer';

function SearchBar() {
  const [query, setQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [suggestions, setSuggestions] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const dropdownRef = useRef(null);
  const searchTimeoutRef = useRef(null);
  const inputRef = useRef(null);

  const { playTrack, searchHistory, addSearchQuery } = usePlayer();

  const shouldShowHistory = useMemo(() => {
    const trimmed = query.trim();
    return isFocused && trimmed.length < 2 && searchHistory.length > 0;
  }, [isFocused, query, searchHistory.length]);

  // Fetch suggestions when query changes
  useEffect(() => {
    const trimmed = query.trim();
    const authed = isAuthenticated();

    if (!trimmed || trimmed.length < 2 || !authed) {
      setSuggestions(null);
      setIsLoading(false);
      if (shouldShowHistory) {
        setShowDropdown(true);
      } else {
        setShowDropdown(false);
      }
      return;
    }

    // Debounce search - wait 300ms after user stops typing
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(async () => {
      try {
        setIsLoading(true);
        const results = await searchSpotify(query, 4);
        setSuggestions(results);
        setShowDropdown(true);
      } catch (error) {
        console.error('Search error:', error);
        setSuggestions(null);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [query, shouldShowHistory]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
        setIsFocused(false);
        setIsExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    addSearchQuery(trimmed);
    // Keep dropdown behavior non-intrusive: suggestions (if any) will show via effect
  };

  const handleSuggestionClick = async (item, type) => {
    // Handle different types of clicks
    if (type === 'track') {
      try {
        const trimmed = query.trim();
        if (trimmed) addSearchQuery(trimmed);

        await playTrack(item.uri, {
          id: item.id,
          uri: item.uri,
          title: item.name,
          artist: item.artists?.map((a) => a.name).join(', ') || '',
          album: item.album?.name || '',
          albumArt: item.album?.images?.[0]?.url
        });
        console.log('Playing track:', item.name);
      } catch (error) {
        console.error('Failed to play:', error);
        alert(error.message);
      }
    } else if (type === 'artist') {
      console.log('Artist selected:', item);
      window.open(item.external_urls.spotify, '_blank');
    } else if (type === 'album') {
      console.log('Album selected:', item);
      window.open(item.external_urls.spotify, '_blank');
    }
    setShowDropdown(false);
  };

  const handleHistoryClick = (historyItem) => {
    addSearchQuery(historyItem);
    setQuery(historyItem);
    setShowDropdown(true);
  };

  return (
    <div ref={dropdownRef} className="w-full relative">
      <form onSubmit={handleSubmit}>
        <div className="relative group">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              setIsExpanded(true);
              setIsFocused(true);
              if (suggestions || shouldShowHistory) setShowDropdown(true);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setShowDropdown(false);
                inputRef.current?.blur();
              }
            }}
            placeholder="Search for songs, artists, or albums..."
            className={`w-full py-3 px-6 pr-12 rounded-full bg-purple-900/50 border-2 border-purple-700/50 text-white placeholder-purple-300/60 focus:outline-none focus:border-fuchsia-500 focus:bg-purple-900/70 transition-all duration-300 ${
              isExpanded ? 'shadow-lg shadow-fuchsia-500/20' : ''
            }`}
          />
          
          {/* Search icon/button */}
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-fuchsia-600 hover:bg-fuchsia-500 text-white transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!query.trim()}
          >
            {isLoading ? (
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            )}
          </button>

          {/* Clear button */}
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setSuggestions(null);
                if (shouldShowHistory) {
                  setShowDropdown(true);
                } else {
                  setShowDropdown(false);
                }
              }}
              className="absolute right-14 top-1/2 -translate-y-1/2 p-1 text-purple-300 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}
        </div>
      </form>

      {/* Dropdown Suggestions */}
      {showDropdown && (suggestions || shouldShowHistory) && (
        <div className="absolute top-full mt-2 w-full bg-purple-900 border-2 border-fuchsia-600/50 rounded-2xl shadow-2xl shadow-fuchsia-500/20 overflow-hidden z-50 max-h-96 overflow-y-auto">
          {/* Search History (subtle, only when input is empty/short) */}
          {shouldShowHistory && !suggestions && (
            <div className="p-3">
              <h3 className="text-[11px] font-bold text-purple-300 uppercase mb-2 px-2">Recent searches</h3>
              <div className="space-y-1">
                {searchHistory.slice(0, 4).map((historyItem) => (
                  <button
                    key={historyItem}
                    onClick={() => handleHistoryClick(historyItem)}
                    className="w-full flex items-center gap-2.5 p-2 hover:bg-fuchsia-800/20 rounded-lg transition-all duration-200 text-left"
                  >
                    <svg className="w-4 h-4 text-purple-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-5.2-5.2m2.2-5.3a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <span className="text-sm text-white/90 truncate">{historyItem}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tracks Section */}
          {suggestions?.tracks?.items?.length > 0 && (
            <div className="p-3">
              <h3 className="text-xs font-bold text-fuchsia-400 uppercase mb-2 px-2">Tracks</h3>
              {suggestions.tracks.items.map((track) => (
                <button
                  key={track.id}
                  onClick={() => handleSuggestionClick(track, 'track')}
                  className="w-full flex items-center gap-3 p-2 hover:bg-fuchsia-800/30 rounded-lg transition-all duration-200 text-left group"
                >
                  <img
                    src={track.album.images[2]?.url || track.album.images[0]?.url}
                    alt={track.name}
                    className="w-12 h-12 rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate group-hover:text-fuchsia-300">
                      {track.name}
                    </p>
                    <p className="text-gray-400 text-sm truncate">
                      {track.artists.map(a => a.name).join(', ')}
                    </p>
                  </div>
                  <span className="text-xs text-gray-500 bg-purple-800/50 px-2 py-1 rounded">Track</span>
                </button>
              ))}
            </div>
          )}

          {/* Artists Section */}
          {suggestions?.artists?.items?.length > 0 && (
            <div className="p-3 border-t border-purple-700/50">
              <h3 className="text-xs font-bold text-fuchsia-400 uppercase mb-2 px-2">Artists</h3>
              {suggestions.artists.items.map((artist) => (
                <button
                  key={artist.id}
                  onClick={() => handleSuggestionClick(artist, 'artist')}
                  className="w-full flex items-center gap-3 p-2 hover:bg-fuchsia-800/30 rounded-lg transition-all duration-200 text-left group"
                >
                  <img
                    src={artist.images[2]?.url || artist.images[0]?.url || 'https://via.placeholder.com/48/5B21B6/FFFFFF?text=Artist'}
                    alt={artist.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate group-hover:text-fuchsia-300">
                      {artist.name}
                    </p>
                    <p className="text-gray-400 text-sm capitalize">
                      {artist.genres[0] || 'Artist'}
                    </p>
                  </div>
                  <span className="text-xs text-gray-500 bg-purple-800/50 px-2 py-1 rounded">Artist</span>
                </button>
              ))}
            </div>
          )}

          {/* Albums Section */}
          {suggestions?.albums?.items?.length > 0 && (
            <div className="p-3 border-t border-purple-700/50">
              <h3 className="text-xs font-bold text-fuchsia-400 uppercase mb-2 px-2">Albums</h3>
              {suggestions.albums.items.map((album) => (
                <button
                  key={album.id}
                  onClick={() => handleSuggestionClick(album, 'album')}
                  className="w-full flex items-center gap-3 p-2 hover:bg-fuchsia-800/30 rounded-lg transition-all duration-200 text-left group"
                >
                  <img
                    src={album.images[2]?.url || album.images[0]?.url}
                    alt={album.name}
                    className="w-12 h-12 rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate group-hover:text-fuchsia-300">
                      {album.name}
                    </p>
                    <p className="text-gray-400 text-sm truncate">
                      {album.artists.map(a => a.name).join(', ')}
                    </p>
                  </div>
                  <span className="text-xs text-gray-500 bg-purple-800/50 px-2 py-1 rounded">Album</span>
                </button>
              ))}
            </div>
          )}

          {/* No results */}
          {suggestions && suggestions.tracks?.items?.length === 0 && 
           suggestions.artists?.items?.length === 0 && 
           suggestions.albums?.items?.length === 0 && (
            <div className="p-6 text-center text-gray-400">
              No results found for "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchBar;
