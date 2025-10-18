import { useState, useEffect, useRef } from 'react';
import SongCard from './SongCard';
import { searchByGenre, isAuthenticated } from '../api';

function GenreSection({ genre, gradientFrom, gradientVia, gradientTo }) {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    async function fetchGenreSongs() {
      if (!isAuthenticated()) {
        setLoading(false);
        setError('Please login to see genre tracks');
        return;
      }

      try {
        setLoading(true);
        const tracks = await searchByGenre(genre.toLowerCase(), 10);
        
        const formattedTracks = tracks.map((track, index) => ({
          id: track.id || index,
          title: track.name,
          artist: track.artists.map(artist => artist.name).join(', '),
          album: track.album.name,
          albumArt: track.album.images[0]?.url || 'https://via.placeholder.com/200/5B21B6/FFFFFF?text=No+Image'
        }));
        
        setSongs(formattedTracks);
        setError(null);
      } catch (err) {
        console.error(`Error fetching ${genre} tracks:`, err);
        setError(`Failed to load ${genre} tracks`);
      } finally {
        setLoading(false);
      }
    }

    fetchGenreSongs();
  }, [genre]);

  const scrollToStart = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        left: 0,
        behavior: 'smooth'
      });
    }
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -220,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 220,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className={`bg-gradient-to-r ${gradientFrom} ${gradientVia} ${gradientTo} p-8 rounded-2xl shadow-2xl border border-opacity-30`}>
      <div className="mb-6 flex items-center gap-3">
        <div className="w-12"></div>
        
        <h2 
          onClick={scrollToStart}
          className="text-3xl font-bold text-white hover:opacity-80 transition-opacity cursor-pointer flex items-center gap-2 group"
          title="Back to start"
        >
          {genre}
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
      
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      )}

      {error && !loading && (
        <div className="text-center py-12">
          <p className="text-white/70 text-lg">{error}</p>
        </div>
      )}

      {!loading && !error && songs.length > 0 && (
        <div className="flex items-center gap-3">
          <button
            onClick={scrollLeft}
            className="flex-shrink-0 p-3 bg-black/30 hover:bg-black/50 rounded-full transition-all duration-300 group shadow-lg"
            aria-label="Scroll left"
          >
            <svg 
              className="w-6 h-6 text-white/80 group-hover:text-white group-hover:scale-110 transition-all" 
              fill="currentColor" 
              viewBox="0 0 24 24"
            >
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
            </svg>
          </button>

          <div 
            ref={scrollContainerRef}
            className="flex-1 flex gap-4 overflow-x-auto pb-4 scroll-smooth custom-scrollbar"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: '#581c87 #3b0764'
            }}
          >
            {songs.map((song) => (
              <SongCard key={song.id} song={song} />
            ))}
          </div>

          <button
            onClick={scrollRight}
            className="flex-shrink-0 p-3 bg-black/30 hover:bg-black/50 rounded-full transition-all duration-300 group shadow-lg"
            aria-label="Scroll right"
          >
            <svg 
              className="w-6 h-6 text-white/80 group-hover:text-white group-hover:scale-110 transition-all" 
              fill="currentColor" 
              viewBox="0 0 24 24"
            >
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
            </svg>
          </button>
        </div>
      )}

      {!loading && !error && songs.length === 0 && (
        <div className="text-center py-12">
          <p className="text-white/70 text-lg">No {genre} tracks found</p>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          height: 16px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: linear-gradient(180deg, #1e0838 0%, #2e1065 30%, #3b0764 50%, #2e1065 70%, #1e0838 100%);
          border-radius: 10px;
          box-shadow: 
            inset 0 3px 6px rgba(0, 0, 0, 0.5),
            0 1px 2px rgba(168, 85, 247, 0.1);
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, 
            #7e22ce 0%, 
            #9333ea 25%, 
            #a855f7 50%, 
            #9333ea 75%, 
            #7e22ce 100%);
          border-radius: 10px;
          box-shadow: 
            0 0 12px rgba(168, 85, 247, 0.6),
            0 0 24px rgba(168, 85, 247, 0.3),
            inset 0 3px 6px rgba(255, 255, 255, 0.25),
            inset 0 -3px 6px rgba(0, 0, 0, 0.35);
          transition: all 0.3s ease;
          border: 1px solid rgba(168, 85, 247, 0.3);
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, 
            #9333ea 0%, 
            #a855f7 25%, 
            #c084fc 50%, 
            #a855f7 75%, 
            #9333ea 100%);
          box-shadow: 
            0 0 20px rgba(192, 132, 252, 0.8),
            0 0 35px rgba(168, 85, 247, 0.5),
            inset 0 3px 8px rgba(255, 255, 255, 0.35),
            inset 0 -3px 8px rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(192, 132, 252, 0.5);
        }
      `}</style>
    </div>
  );
}

export default GenreSection;
