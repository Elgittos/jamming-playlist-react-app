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
      <div className="w-full theme-card p-3 rounded-xl shadow-lg">
        <div className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-400"></div>
          <span className="text-sm text-purple-300">Loading playlists...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full theme-card p-3 rounded-xl shadow-lg">
        <p className="text-sm text-red-400">{error}</p>
      </div>
    );
  }

  if (playlists.length === 0) {
    return null;
  }

  return (
    <div className="w-full theme-card p-3 rounded-xl shadow-lg">
      <div className="flex items-center gap-2 mb-2">
        <svg className="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
        </svg>
        <h3 className="text-sm font-semibold text-white">Your Playlists</h3>
      </div>
      
      {/* Horizontal scrollable strip */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-purple-700 scrollbar-track-purple-950">
        {playlists.map((playlist) => (
          <button
            key={playlist.id}
            onClick={() => onPlaylistSelect(playlist.id)}
            className={`flex-shrink-0 px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium whitespace-nowrap ${
              selectedPlaylistId === playlist.id 
                ? 'bg-purple-600 text-white shadow-lg' 
                : 'bg-purple-900/40 text-purple-200 hover:bg-purple-800/60 hover:text-white'
            }`}
          >
            {playlist.name}
          </button>
        ))}
      </div>
    </div>
  );
}
