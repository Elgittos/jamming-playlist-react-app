import SongCard from './SongCard';
import { usePlayer } from '../hooks/usePlayer';

function RecentlyPlayed({ theme = 'original' }) {
  const { isAuthed, recentlyPlayed, isRecentlyPlayedSeeded } = usePlayer();
  const loading = !isRecentlyPlayedSeeded;

  const isLight = theme === 'light';
  const containerClasses =
    theme === 'dark'
      ? 'bg-gradient-to-br from-zinc-950/85 via-zinc-950 to-black border border-white/10'
      : theme === 'light'
        ? 'bg-white/75 border border-zinc-200'
        : 'bg-gradient-to-br from-fuchsia-900 via-pink-950 to-black border border-fuchsia-800/30';

  const primaryText = isLight ? 'text-zinc-900' : 'text-white';
  const secondaryText = isLight ? 'text-zinc-600' : 'text-fuchsia-300';

  return (
    <div className={`w-full ${containerClasses} rounded-2xl shadow-2xl p-3 sm:p-4 lg:p-5 backdrop-blur`}>
      <h2 className={`text-lg sm:text-xl lg:text-2xl font-bold ${primaryText} mb-2.5 sm:mb-3`}>Recently Played</h2>
      
      {/* Loading state */}
      {loading && (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fuchsia-400"></div>
        </div>
      )}

      {!loading && !isAuthed && (
        <div className="text-center py-10">
          <p className={`${secondaryText} text-base sm:text-lg`}>Please login to see your recently played tracks</p>
        </div>
      )}

      {/* Tracks display */}
      {!loading && isAuthed && recentlyPlayed.length > 0 && (
        <div className="relative">
          {/* Scrollable container */}
          <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-3 scrollbar-thin scrollbar-thumb-fuchsia-700 scrollbar-track-fuchsia-950">
            {recentlyPlayed.map((song) => (
              <SongCard key={song.id} song={song} />
            ))}
          </div>
        </div>
      )}

      {/* No tracks state */}
      {!loading && isAuthed && recentlyPlayed.length === 0 && (
        <div className="text-center py-10">
          <p className={`${secondaryText} text-base sm:text-lg`}>No recently played tracks found</p>
        </div>
      )}
    </div>
  );
}

export default RecentlyPlayed;
