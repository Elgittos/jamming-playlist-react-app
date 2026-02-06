import SongCard from './SongCard';
import { usePlayer } from '../hooks/usePlayer';

function RecentlyPlayed({ compact = false }) {
  const { isAuthed, recentlyPlayed, isRecentlyPlayedSeeded } = usePlayer();
  const loading = !isRecentlyPlayedSeeded;

  return (
    <div className={`w-full surface-panel rounded-2xl border border-fuchsia-800/30 ${compact ? 'p-3 sm:p-4' : 'p-4 sm:p-5 lg:p-6'}`}>
      <h2 className={`${compact ? 'text-base sm:text-lg' : 'text-xl sm:text-2xl'} font-bold text-white mb-2.5 sm:mb-3`}>
        Recently Played
      </h2>
      
      {/* Loading state */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-fuchsia-400"></div>
        </div>
      )}

      {!loading && !isAuthed && (
        <div className="text-center py-8">
          <p className="text-fuchsia-300 text-sm sm:text-base">Please login to see your recently played tracks</p>
        </div>
      )}

      {/* Tracks display */}
      {!loading && isAuthed && recentlyPlayed.length > 0 && (
        <div className="relative">
          {/* Scrollable container */}
          <div className="flex gap-2.5 sm:gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-fuchsia-700 scrollbar-track-fuchsia-950">
            {recentlyPlayed.map((song) => (
              <SongCard key={song.id} song={song} compact />
            ))}
          </div>
        </div>
      )}

      {/* No tracks state */}
      {!loading && isAuthed && recentlyPlayed.length === 0 && (
        <div className="text-center py-8">
          <p className="text-fuchsia-300 text-sm sm:text-base">No recently played tracks found</p>
        </div>
      )}
    </div>
  );
}

export default RecentlyPlayed;
