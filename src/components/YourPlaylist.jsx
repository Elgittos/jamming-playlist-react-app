import { useState, useEffect } from 'react';
import { getUserPlaylists, isAuthenticated } from '../api';

function YourPlaylist() {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPlaylists() {
      // Check if user is authenticated
      if (!isAuthenticated()) {
        setLoading(false);
        setError('Please login to see your playlists');
        return;
      }

      try {
        setLoading(true);
        const playlistData = await getUserPlaylists(20);
        setPlaylists(playlistData);
        setError(null);
      } catch (err) {
        console.error('Error fetching playlists:', err);
        setError('Failed to load playlists');
      } finally {
        setLoading(false);
      }
    }

    fetchPlaylists();
  }, []);

  return (
    <div className="flex-1 bg-gradient-to-br from-emerald-900 via-green-950 to-black rounded-2xl shadow-2xl p-10 min-h-[400px] border border-emerald-800/30">
      <h2 className="text-3xl font-bold text-white mb-6">Your Playlists</h2>
      
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

      {/* Playlists display */}
      {!loading && !error && playlists.length > 0 && (
        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-emerald-700 scrollbar-track-emerald-950">
          {playlists.map((playlist) => (
            <div
              key={playlist.id}
              className="bg-emerald-950/50 hover:bg-emerald-900/50 rounded-lg p-4 border border-emerald-800/30 transition-all duration-300 hover:scale-[1.02] cursor-pointer group"
            >
              <div className="flex items-center gap-4">
                {/* Playlist Image */}
                {playlist.images && playlist.images[0] ? (
                  <img
                    src={playlist.images[0].url}
                    alt={playlist.name}
                    className="w-16 h-16 rounded-md object-cover shadow-lg"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-md bg-emerald-800 flex items-center justify-center">
                    <span className="text-2xl">🎵</span>
                  </div>
                )}
                
                {/* Playlist Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold text-lg truncate group-hover:text-emerald-300 transition-colors">
                    {playlist.name}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {playlist.tracks.total} {playlist.tracks.total === 1 ? 'track' : 'tracks'}
                  </p>
                  {playlist.description && (
                    <p className="text-gray-500 text-xs mt-1 truncate">
                      {playlist.description.replace(/<[^>]*>/g, '')} {/* Remove HTML tags */}
                    </p>
                  )}
                </div>

                {/* Public/Private Badge */}
                <div className="flex items-center gap-2">
                  {playlist.public ? (
                    <span className="text-xs px-2 py-1 bg-emerald-700/30 text-emerald-300 rounded-full">
                      Public
                    </span>
                  ) : (
                    <span className="text-xs px-2 py-1 bg-gray-700/30 text-gray-400 rounded-full">
                      Private
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No playlists state */}
      {!loading && !error && playlists.length === 0 && (
        <div className="text-center py-12">
          <p className="text-emerald-300 text-lg">No playlists found</p>
          <p className="text-gray-400 text-sm mt-2">Create your first playlist in Spotify!</p>
        </div>
      )}
    </div>
  );
}

export default YourPlaylist;
