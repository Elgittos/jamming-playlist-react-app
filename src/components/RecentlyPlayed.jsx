import SongCard from './SongCard';
import { usePlayer } from '../hooks/usePlayer';

function RecentlyPlayed() {
  const { isAuthed, recentlyPlayed, isRecentlyPlayedSeeded } = usePlayer();
  const loading = !isRecentlyPlayedSeeded;

  return (
    <div className="w-full bg-gradient-to-br from-fuchsia-900 via-pink-950 to-black rounded-2xl shadow-2xl p-4 sm:p-6 lg:p-8 border border-fuchsia-800/30">
      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-3 sm:mb-4">Recently Played</h2>
      
      {/* Loading state */}
      {loading && (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fuchsia-400"></div>
        </div>
      )}

      {!loading && !isAuthed && (
        <div className="text-center py-10">
          <p className="text-fuchsia-300 text-base sm:text-lg">Please login to see your recently played tracks</p>
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
          <p className="text-fuchsia-300 text-base sm:text-lg">No recently played tracks found</p>
        </div>
      )}
    </div>
  );
}

export default RecentlyPlayed;
