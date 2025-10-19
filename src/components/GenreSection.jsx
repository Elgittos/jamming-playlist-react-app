import { useState, useEffect } from 'react';
import SongCard from './SongCard';
import { searchByGenre, isAuthenticated } from '../api';

function GenreSection({ genre, gradientFrom, gradientVia, gradientTo }) {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
          uri: track.uri,
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

  return (
    <div className={`w-full bg-gradient-to-br ${gradientFrom} ${gradientVia} ${gradientTo} rounded-2xl shadow-2xl p-10 border border-opacity-30`}>
      <h2 className="text-3xl font-bold text-white mb-6">{genre}</h2>
      
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
        <div className="relative">
          {/* Scrollable container */}
          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-purple-700 scrollbar-track-purple-950">
            {songs.map((song) => (
              <SongCard key={song.id} song={song} />
            ))}
          </div>
        </div>
      )}

      {!loading && !error && songs.length === 0 && (
        <div className="text-center py-12">
          <p className="text-white/70 text-lg">No {genre} tracks found</p>
        </div>
      )}
    </div>
  );
}

export default GenreSection;
