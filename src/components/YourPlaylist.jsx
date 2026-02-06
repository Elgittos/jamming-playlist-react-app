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
    } catch (playError) {
      console.error('Error playing track:', playError);
      alert('Failed to play track. Make sure Spotify is active.');
    }
  };

  const formatDuration = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full surface-panel rounded-2xl p-3 sm:p-4 h-full border border-teal-800/30 flex flex-col">
      <h2 className="text-base sm:text-lg font-bold text-white mb-2.5 sm:mb-3">Playlist Tracks</h2>

      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-400" />
        </div>
      )}

      {error && !loading && (
        <div className="text-center py-8">
          <p className="text-teal-300 text-sm sm:text-base">{error}</p>
        </div>
      )}

      {!selectedPlaylistId && !loading && (
        <div className="flex justify-center items-center py-8 flex-1">
          <p className="text-gray-300 text-sm sm:text-base text-center">
            Select a playlist to view its tracks
          </p>
        </div>
      )}

      {!loading && !error && tracks.length > 0 && (
        <div className="space-y-1.5 max-h-[52vh] xl:max-h-[620px] overflow-y-auto pr-1.5 scrollbar-thin scrollbar-thumb-teal-700 scrollbar-track-teal-950">
          {tracks.map((track, index) => (
            <button
              type="button"
              key={`${track.id}-${index}`}
              onClick={() => handleTrackClick(track.uri)}
              className="w-full bg-teal-950/45 hover:bg-teal-900/50 rounded-lg p-2.5 border border-teal-800/30 transition-all duration-300 cursor-pointer group flex items-center gap-2 text-left"
            >
              <div className="w-7 text-center text-gray-400 group-hover:text-teal-300 text-xs sm:text-sm">
                {index + 1}
              </div>

              {track.albumImage ? (
                <img
                  src={track.albumImage}
                  alt={track.album}
                  className="w-10 h-10 rounded object-cover shadow-lg"
                />
              ) : (
                <div className="w-10 h-10 rounded bg-teal-800 flex items-center justify-center">
                  <span className="text-sm font-semibold text-slate-100">&#9835;</span>
                </div>
              )}

              <div className="flex-1 min-w-0">
                <h3 className="text-white font-semibold text-sm sm:text-base truncate group-hover:text-teal-300 transition-colors">
                  {track.name}
                </h3>
                <p className="text-gray-400 text-xs sm:text-sm truncate">
                  {track.artists}
                </p>
              </div>

              <div className="hidden md:block flex-1 min-w-0 max-w-[160px]">
                <p className="text-gray-400 text-xs sm:text-sm truncate">
                  {track.album}
                </p>
              </div>

              <div className="text-gray-300 text-xs sm:text-sm">
                {formatDuration(track.duration)}
              </div>

              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="w-6 h-6 text-teal-300" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                </svg>
              </div>
            </button>
          ))}
        </div>
      )}

      {!loading && !error && selectedPlaylistId && tracks.length === 0 && (
        <div className="text-center py-8">
          <p className="text-teal-300 text-sm sm:text-base">This playlist is empty</p>
          <p className="text-gray-400 text-xs sm:text-sm mt-1.5">Add some tracks in Spotify.</p>
        </div>
      )}
    </div>
  );
}

export default YourPlaylist;



