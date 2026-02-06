import { useState, useEffect } from 'react';
import { getPlaylistTracks } from '../api';
import { usePlayer } from '../hooks/usePlayer';

function YourPlaylist({ selectedPlaylistId }) {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { playTrack } = usePlayer();

  useEffect(() => {
    async function fetchPlaylistTracks() {
      if (!selectedPlaylistId) {
        setTracks([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const trackData = await getPlaylistTracks(selectedPlaylistId);
        setTracks(trackData);
        setError(null);
      } catch (err) {
        console.error('Error fetching playlist tracks:', err);
        setError(err.message || 'Failed to load tracks');
      } finally {
        setLoading(false);
      }
    }

    fetchPlaylistTracks();
  }, [selectedPlaylistId]);

  const handleTrackClick = async (trackUri) => {
    try {
      const track = tracks.find((t) => t.uri === trackUri);
      await playTrack(trackUri, track ? {
        id: track.id,
        uri: track.uri,
        title: track.name,
        artist: track.artists,
        album: track.album,
        albumArt: track.albumImage
      } : null);
    } catch (error) {
      console.error('Error playing track:', error);
      alert('Failed to play track. Make sure Spotify is active!');
    }
  };

  const formatDuration = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full bg-gradient-to-br from-emerald-900 via-green-950 to-black rounded-2xl shadow-2xl p-4 sm:p-6 lg:p-8 h-full border border-emerald-800/30 flex flex-col">
      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-3 sm:mb-4">Playlist Tracks</h2>
      
      {/* Loading state */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400"></div>
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="text-center py-12">
          <p className="text-emerald-300 text-lg">{error}</p>
        </div>
      )}

      {/* No playlist selected */}
      {!selectedPlaylistId && !loading && (
        <div className="flex justify-center items-center py-12 flex-1">
          <p className="text-gray-400 text-lg text-center">
            Select a playlist to view its tracks
          </p>
        </div>
      )}

      {/* Tracks display */}
      {!loading && !error && tracks.length > 0 && (
        <div className="space-y-1.5 max-h-[50vh] sm:max-h-[650px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-emerald-700 scrollbar-track-emerald-950">
          {tracks.map((track, index) => (
            <div
              key={track.id + index}
              onClick={() => handleTrackClick(track.uri)}
              className="bg-emerald-950/50 hover:bg-emerald-900/50 rounded-lg p-2.5 border border-emerald-800/30 transition-all duration-300 hover:scale-[1.01] cursor-pointer group flex items-center gap-2.5"
            >
              {/* Track Number */}
              <div className="w-8 text-center text-gray-400 group-hover:text-emerald-300 text-sm">
                {index + 1}
              </div>

              {/* Album Image */}
              {track.albumImage ? (
                <img
                  src={track.albumImage}
                  alt={track.album}
                  className="w-11 h-11 rounded object-cover shadow-lg"
                />
              ) : (
                <div className="w-11 h-11 rounded bg-emerald-800 flex items-center justify-center">
                  <span className="text-xl">🎵</span>
                </div>
              )}
              
              {/* Track Info */}
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-semibold text-base truncate group-hover:text-emerald-300 transition-colors">
                  {track.name}
                </h3>
                <p className="text-gray-400 text-sm truncate">
                  {track.artists}
                </p>
              </div>

              {/* Album Name */}
              <div className="hidden md:block flex-1 min-w-0">
                <p className="text-gray-400 text-sm truncate">
                  {track.album}
                </p>
              </div>

              {/* Duration */}
              <div className="text-gray-400 text-sm">
                {formatDuration(track.duration)}
              </div>

              {/* Play Button (visible on hover) */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="w-8 h-8 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No tracks in playlist */}
      {!loading && !error && selectedPlaylistId && tracks.length === 0 && (
        <div className="text-center py-12">
          <p className="text-emerald-300 text-lg">This playlist is empty</p>
          <p className="text-gray-400 text-sm mt-2">Add some tracks in Spotify!</p>
        </div>
      )}
    </div>
  );
}

export default YourPlaylist;
