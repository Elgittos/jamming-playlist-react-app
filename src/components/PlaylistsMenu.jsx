import React, { useState, useEffect } from 'react';
import { getUserPlaylists } from '../api';

export default function PlaylistsMenu({ onPlaylistSelect, selectedPlaylistId }) {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        setLoading(true);
        const data = await getUserPlaylists(20);
        setPlaylists(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching playlists:', err);
        setError('Failed to load playlists');
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, []);

  if (loading) {
    return (
      <div className="w-full bg-gradient-to-br from-indigo-900 via-purple-950 to-black rounded-2xl shadow-2xl p-5 sm:p-8 lg:p-10 border border-indigo-800/30">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-4 sm:mb-6">Your Playlists</h2>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-400"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-gradient-to-br from-indigo-900 via-purple-950 to-black rounded-2xl shadow-2xl p-5 sm:p-8 lg:p-10 border border-indigo-800/30">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-4 sm:mb-6">Your Playlists</h2>
        <p className="text-indigo-300 text-center py-12">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-gradient-to-br from-indigo-900 via-purple-950 to-black rounded-2xl shadow-2xl p-5 sm:p-8 lg:p-10 border border-indigo-800/30">
      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-4 sm:mb-6">Your Playlists</h2>
      
      <div className="relative">
        {/* Scrollable container */}
        <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-indigo-700 scrollbar-track-indigo-950">
          {playlists.map((playlist) => (
            <div
              key={playlist.id}
              onClick={() => onPlaylistSelect(playlist.id)}
              className={`flex-shrink-0 w-[160px] sm:w-[180px] lg:w-[200px] h-[240px] sm:h-[260px] lg:h-[280px] bg-gradient-to-br from-indigo-800/50 to-purple-900/50 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl border-2 ${
                selectedPlaylistId === playlist.id 
                  ? 'border-indigo-400 shadow-lg shadow-indigo-500/50' 
                  : 'border-indigo-800/30'
              }`}
            >
              {/* Playlist Image */}
              <div className="h-[140px] sm:h-[160px] lg:h-[200px] w-full overflow-hidden">
                {playlist.images && playlist.images[0] ? (
                  <img
                    src={playlist.images[0].url}
                    alt={playlist.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center">
                    <svg className="w-16 h-16 text-white/50" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Playlist Info */}
              <div className="p-3 sm:p-4">
                <h3 className="text-white font-semibold text-xs sm:text-sm line-clamp-2 mb-1">
                  {playlist.name}
                </h3>
                <p className="text-indigo-300 text-[11px] sm:text-xs">
                  {playlist.tracks.total} tracks
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
