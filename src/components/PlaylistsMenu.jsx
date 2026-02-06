import { useEffect, useState } from 'react';
import { getUserPlaylists } from '../api';

export default function PlaylistsMenu({ onPlaylistSelect, selectedPlaylistId }) {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        setLoading(true);
        const data = await getUserPlaylists(30);
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

  return (
    <div className="surface-panel rounded-2xl p-3 sm:p-4">
      <div className="mb-2 flex items-center justify-between gap-3">
        <h2 className="text-base sm:text-lg font-semibold text-white">Playlists</h2>
        {selectedPlaylistId && (
          <button
            type="button"
            onClick={() => onPlaylistSelect(null)}
            className="text-xs sm:text-sm text-cyan-300 hover:text-cyan-200"
          >
            Clear
          </button>
        )}
      </div>

      {loading && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="h-11 w-28 shrink-0 animate-pulse rounded-full bg-sky-900/35" />
          ))}
        </div>
      )}

      {error && !loading && <p className="text-sm text-red-300">{error}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto pb-1">
          <div className="flex min-w-max items-center gap-2.5 pr-1">
            <button
              type="button"
              onClick={() => onPlaylistSelect(null)}
              className={`h-11 shrink-0 rounded-full border px-4 text-sm transition-colors ${
                selectedPlaylistId === null
                  ? 'border-cyan-400 bg-cyan-600/30 text-white'
                  : 'border-sky-700/35 bg-slate-900/35 text-sky-100 hover:bg-sky-900/35'
              }`}
            >
              All Playlists
            </button>

            {playlists.map((playlist) => (
              <button
                key={playlist.id}
                type="button"
                onClick={() => onPlaylistSelect(playlist.id)}
                className={`h-11 shrink-0 rounded-full border px-4 text-sm transition-colors ${
                  selectedPlaylistId === playlist.id
                    ? 'border-cyan-400 bg-cyan-600/30 text-white'
                    : 'border-sky-700/35 bg-slate-900/35 text-sky-100 hover:bg-sky-900/35'
                }`}
                title={`${playlist.name} - ${playlist.tracks.total} tracks`}
              >
                {playlist.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}




