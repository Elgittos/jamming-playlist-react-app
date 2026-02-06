import React, { useMemo, useState, useEffect } from 'react';
import { getUserPlaylists } from '../api';

export default function PlaylistsMenu({ onPlaylistSelect, selectedPlaylistId, theme = 'original' }) {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isLight = theme === 'light';

  const containerClasses = useMemo(() => {
    if (theme === 'dark') {
      return 'bg-gradient-to-br from-zinc-950/80 via-zinc-950 to-black border border-white/10';
    }
    if (theme === 'light') {
      return 'bg-white/75 border border-zinc-200';
    }
    return 'bg-gradient-to-br from-indigo-900 via-purple-950 to-black border border-indigo-800/30';
  }, [theme]);

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
      <div className={`w-full ${containerClasses} rounded-2xl shadow-2xl p-2.5 sm:p-3 backdrop-blur`}>
        <div className="flex items-center justify-between gap-3">
          <h2 className={`text-sm sm:text-base font-bold ${isLight ? 'text-zinc-900' : 'text-white'} shrink-0`}>Playlists</h2>
          <div className="flex items-center gap-2">
            <div className={`animate-spin rounded-full h-5 w-5 border-b-2 ${isLight ? 'border-zinc-600' : 'border-indigo-300'}`}></div>
            <span className={`text-xs ${isLight ? 'text-zinc-600' : 'text-indigo-200'}`}>Loading…</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`w-full ${containerClasses} rounded-2xl shadow-2xl p-2.5 sm:p-3 backdrop-blur`}>
        <div className="flex items-center justify-between gap-3">
          <h2 className={`text-sm sm:text-base font-bold ${isLight ? 'text-zinc-900' : 'text-white'} shrink-0`}>Playlists</h2>
          <p className={`text-xs ${isLight ? 'text-zinc-600' : 'text-indigo-200'}`}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full ${containerClasses} rounded-2xl shadow-2xl p-2.5 sm:p-3 backdrop-blur`}>
      <div className="flex items-center gap-3">
        <h2 className={`text-sm sm:text-base font-bold ${isLight ? 'text-zinc-900' : 'text-white'} shrink-0`}>Playlists</h2>

        <div className="flex-1 min-w-0">
          <div className="flex gap-2 overflow-x-auto py-1 pr-1 scrollbar-thin scrollbar-thumb-indigo-700 scrollbar-track-indigo-950">
            {playlists.map((playlist) => {
              const selected = selectedPlaylistId === playlist.id;
              return (
                <button
                  key={playlist.id}
                  type="button"
                  onClick={() => onPlaylistSelect(playlist.id)}
                  className={
                    `flex-shrink-0 px-3 py-2 rounded-full text-sm font-semibold transition-colors border ` +
                    (selected
                      ? (isLight
                          ? 'bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200'
                          : 'bg-indigo-500/20 text-white border-indigo-300/40')
                      : (isLight
                          ? 'bg-white/70 text-zinc-800 border-zinc-200 hover:bg-zinc-100'
                          : 'bg-white/5 text-white/90 border-white/10 hover:bg-white/10'))
                  }
                >
                  <span className="truncate max-w-[14rem] inline-block align-middle">{playlist.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
