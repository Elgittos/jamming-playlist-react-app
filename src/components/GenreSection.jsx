import { useState, useEffect } from 'react';
import SongCard from './SongCard';
import { useAudio, AudioSourceType } from '../audio';
import { searchByGenre, isAuthenticated } from '../api';

function GenreSection({ genre, gradientFrom, gradientVia, gradientTo }) {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { search, currentSource } = useAudio();

  useEffect(() => {
    async function fetchGenreSongs() {
      try {
        setLoading(true);
        setError(null);

        // Use new audio system for Openverse and RoyalFree
        if (currentSource === AudioSourceType.OPENVERSE || currentSource === AudioSourceType.ROYALFREE) {
          const results = await search({
            q: genre.toLowerCase(),
            pageSize: 10,
          });

          // Map to SongCard format
          const formattedTracks = results.map((track) => ({
            id: track.id,
            uri: track.uri,
            title: track.title,
            artist: track.artist,
            album: track.title, // Use title as album for non-Spotify sources
            albumArt: track.thumbnailUrl || 'https://via.placeholder.com/200/5B21B6/FFFFFF?text=No+Image',
            audioUrl: track.audioUrl,
            source: track.source,
          }));

          setSongs(formattedTracks);
        } else if (currentSource === AudioSourceType.SPOTIFY) {
          // Fall back to Spotify API for backward compatibility
          if (!isAuthenticated()) {
            setError('Please login to see genre tracks');
            setLoading(false);
            return;
          }

          const tracks = await searchByGenre(genre.toLowerCase(), 10);
          
          const formattedTracks = tracks.map((track, index) => ({
            id: track.id || index,
            uri: track.uri,
            title: track.name,
            artist: track.artists.map(artist => artist.name).join(', '),
            album: track.album.name,
            albumArt: track.album.images[0]?.url || 'https://via.placeholder.com/200/5B21B6/FFFFFF?text=No+Image',
            source: AudioSourceType.SPOTIFY,
          }));
          
          setSongs(formattedTracks);
        }
      } catch (err) {
        console.error(`Error fetching ${genre} tracks:`, err);
        setError(`Failed to load ${genre} tracks`);
      } finally {
        setLoading(false);
      }
    }

    fetchGenreSongs();
  }, [genre, currentSource, search]);

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
