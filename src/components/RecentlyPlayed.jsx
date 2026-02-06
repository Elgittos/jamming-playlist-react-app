import { useEffect } from 'react';
import SongCard from './SongCard';
import { getRecentlyPlayed, isAuthenticated } from '../api';
import { usePlayer } from '../contexts/PlayerContext';

function RecentlyPlayed() {
  const { recentlyPlayed, addToRecentlyPlayed } = usePlayer();

  useEffect(() => {
    async function fetchRecentlyPlayed() {
      // Only fetch if user is authenticated
      if (!isAuthenticated()) {
        return;
      }

      try {
        const tracks = await getRecentlyPlayed(20); // Get last 20 tracks
        
        // Transform Spotify API data to match our component structure
        const formattedTracks = tracks.map((item) => ({
          id: item.track.id,
          uri: item.track.uri,
          title: item.track.name,
          artist: item.track.artists.map(artist => artist.name).join(', '),
          album: item.track.album.name,
          albumArt: item.track.album.images[0]?.url || 'https://via.placeholder.com/200/5B21B6/FFFFFF?text=No+Image'
        }));
        
        // Add each track to recently played (context handles deduplication)
        formattedTracks.forEach(track => {
          addToRecentlyPlayed(track);
        });
      } catch (err) {
        console.error('Error fetching recently played:', err);
      }
    }

    fetchRecentlyPlayed();
  }, [addToRecentlyPlayed]);

  return (
    <div className="w-full bg-gradient-to-br from-fuchsia-900 via-pink-950 to-black rounded-2xl shadow-2xl p-4 sm:p-6 border border-fuchsia-800/30">
      <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">Recently Played</h2>
      
      {/* Tracks display */}
      {recentlyPlayed.length > 0 && (
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
      {recentlyPlayed.length === 0 && (
        <div className="text-center py-8">
          <p className="text-fuchsia-300 text-base">No recently played tracks</p>
        </div>
      )}
    </div>
  );
}

export default RecentlyPlayed;
