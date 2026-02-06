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
      <div className="w-full bg-gradient-to-br from-indigo-900/40 via-purple-950/40 to-black/40 rounded-lg shadow-lg p-3 border border-indigo-800/20">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-white">Playlists</h2>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-400"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-gradient-to-br from-indigo-900/40 via-purple-950/40 to-black/40 rounded-lg shadow-lg p-3 border border-indigo-800/20">
        <p className="text-indigo-300 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-gradient-to-br from-indigo-900/40 via-purple-950/40 to-black/40 rounded-lg shadow-lg p-3 border border-indigo-800/20">
      <div className="flex items-center gap-3">
        <h2 className="text-sm font-semibold text-white flex-shrink-0">Playlists</h2>
        
        {/* Horizontal scrollable playlist strip */}
        <div className="flex-1 overflow-x-auto">
          <div className="flex gap-2 pb-1">
            {playlists.map((playlist) => (
              <button
                key={playlist.id}
                onClick={() => onPlaylistSelect(playlist.id)}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                  selectedPlaylistId === playlist.id 
                    ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30' 
                    : 'bg-indigo-800/50 text-indigo-200 hover:bg-indigo-700/60 hover:text-white'
                }`}
              >
                {playlist.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
