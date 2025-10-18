import { useState, useEffect, useRef } from 'react';
import SongCard from './SongCard';
import { getRecentlyPlayed, isAuthenticated } from '../api';

function RecentlyPlayed() {
  const [recentSongs, setRecentSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    async function fetchRecentlyPlayed() {
      // Check if user is authenticated
      if (!isAuthenticated()) {
        setLoading(false);
        setError('Please login to see your recently played tracks');
        return;
      }

      try {
        setLoading(true);
        const tracks = await getRecentlyPlayed(10); // Get last 10 tracks
        
        // Transform Spotify API data to match our component structure
        const formattedTracks = tracks.map((item, index) => ({
          id: item.track.id || index,
          title: item.track.name,
          artist: item.track.artists.map(artist => artist.name).join(', '),
          album: item.track.album.name,
          albumArt: item.track.album.images[0]?.url || 'https://via.placeholder.com/200/5B21B6/FFFFFF?text=No+Image'
        }));
        
        setRecentSongs(formattedTracks);
        setError(null);
      } catch (err) {
        console.error('Error fetching recently played:', err);
        setError('Failed to load recently played tracks');
      } finally {
        setLoading(false);
      }
    }

    fetchRecentlyPlayed();
  }, []);

  // Scroll to first song
  const scrollToStart = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        left: 0,
        behavior: 'smooth'
      });
    }
  };

  // Smooth scroll left
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -220, // One card width + gap
        behavior: 'smooth'
      });
    }
  };

  // Smooth scroll right
  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 220, // One card width + gap
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="bg-gradient-to-r from-fuchsia-950 via-pink-900 to-fuchsia-950 p-8 rounded-2xl shadow-2xl border border-fuchsia-800/30">
      <div className="mb-6 flex items-center justify-between">
        <h2 
          onClick={scrollToStart}
          className="text-3xl font-bold text-white hover:text-fuchsia-300 transition-colors cursor-pointer flex items-center gap-2 group"
          title="Back to first song"
        >
          Recently Played
          <svg 
            className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </h2>
      </div>
      
      {/* Loading state */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="text-center py-12">
          <p className="text-fuchsia-300 text-lg">{error}</p>
        </div>
      )}

      {/* Tracks display with arrows */}
      {!loading && !error && recentSongs.length > 0 && (
        <div className="flex items-center gap-3">
          {/* Left arrow - outside cards */}
          <button
            onClick={scrollLeft}
            className="flex-shrink-0 p-3 bg-fuchsia-800/40 hover:bg-fuchsia-700/60 rounded-full transition-all duration-300 group shadow-lg"
            aria-label="Scroll left"
          >
            <svg 
              className="w-6 h-6 text-fuchsia-200 group-hover:text-white group-hover:scale-110 transition-all" 
              fill="currentColor" 
              viewBox="0 0 24 24"
            >
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
            </svg>
          </button>

          {/* Scrollable container */}
          <div 
            ref={scrollContainerRef}
            className="flex-1 flex gap-4 overflow-x-auto pb-4 scroll-smooth custom-scrollbar"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: '#581c87 #3b0764'
            }}
          >
            {recentSongs.map((song) => (
              <SongCard key={song.id} song={song} />
            ))}
          </div>

          {/* Right arrow - outside cards */}
          <button
            onClick={scrollRight}
            className="flex-shrink-0 p-3 bg-fuchsia-800/40 hover:bg-fuchsia-700/60 rounded-full transition-all duration-300 group shadow-lg"
            aria-label="Scroll right"
          >
            <svg 
              className="w-6 h-6 text-fuchsia-200 group-hover:text-white group-hover:scale-110 transition-all" 
              fill="currentColor" 
              viewBox="0 0 24 24"
            >
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
            </svg>
          </button>
        </div>
      )}

      {/* No tracks state */}
      {!loading && !error && recentSongs.length === 0 && (
        <div className="text-center py-12">
          <p className="text-fuchsia-300 text-lg">No recently played tracks found</p>
        </div>
      )}

      {/* Custom scrollbar styles - Bigger, darker purple, and shiny */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          height: 14px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: linear-gradient(180deg, #2e1065 0%, #3b0764 50%, #2e1065 100%);
          border-radius: 8px;
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.4);
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #6b21a8 0%, #7e22ce 50%, #6b21a8 100%);
          border-radius: 8px;
          box-shadow: 
            0 0 10px rgba(126, 34, 206, 0.5),
            inset 0 2px 4px rgba(255, 255, 255, 0.2),
            inset 0 -2px 4px rgba(0, 0, 0, 0.3);
          transition: all 0.3s ease;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #7e22ce 0%, #9333ea 50%, #7e22ce 100%);
          box-shadow: 
            0 0 16px rgba(147, 51, 234, 0.7),
            inset 0 2px 5px rgba(255, 255, 255, 0.3),
            inset 0 -2px 5px rgba(0, 0, 0, 0.4);
        }
      `}</style>
    </div>
  );
}

export default RecentlyPlayed;
