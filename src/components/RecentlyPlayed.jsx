import SongCard from './SongCard';
import { usePlayer } from '../hooks/usePlayer';

function RecentlyPlayed() {
  const { isAuthed, recentlyPlayed, isRecentlyPlayedSeeded } = usePlayer();
  const loading = !isRecentlyPlayedSeeded;

  return (
    <div className="w-full bg-gradient-to-br from-fuchsia-900/40 via-pink-950/40 to-black/40 rounded-lg shadow-lg p-3 sm:p-4 border border-fuchsia-800/20">
      <h2 className="text-base sm:text-lg lg:text-xl font-bold text-white mb-2 sm:mb-3">Recently Played</h2>
      
      {/* Loading state */}
      {loading && (
        <div className="flex justify-center items-center py-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-fuchsia-400"></div>
        </div>
      )}

      {!loading && !isAuthed && (
        <div className="text-center py-6">
          <p className="text-fuchsia-300 text-sm">Please login to see your recently played tracks</p>
        </div>
      )}

      {/* Tracks display */}
      {!loading && isAuthed && recentlyPlayed.length > 0 && (
        <div className="relative">
          {/* Scrollable container */}
          <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-fuchsia-700 scrollbar-track-fuchsia-950">
            {recentlyPlayed.map((song) => (
              <SongCard key={song.id} song={song} />
            ))}
          </div>
        </div>
      )}

      {/* No tracks state */}
      {!loading && isAuthed && recentlyPlayed.length === 0 && (
        <div className="text-center py-6">
          <p className="text-fuchsia-300 text-sm">No recently played tracks found</p>
        </div>
      )}
    </div>
  );
}

export default RecentlyPlayed;
