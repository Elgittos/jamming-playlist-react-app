import { useState, useEffect } from 'react';
import SongCard from './SongCard';
import { getRecentlyPlayed, isAuthenticated } from '../api';

function RecentlyPlayed() {
  const [recentSongs, setRecentSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchRecentlyPlayed() {
      // Check if user is authenticated
      if (!isAuthenticated()) {
        setLoading(false);
        setError('Please login to see your recently played tracks');
        return;
      }

      try {
        setLoading(true);
        const tracks = await getRecentlyPlayed(10); // Get last 10 tracks
        
        // Transform Spotify API data to match our component structure
        const formattedTracks = tracks.map((item, index) => ({
          id: item.track.id || index,
          uri: item.track.uri,
          title: item.track.name,
          artist: item.track.artists.map(artist => artist.name).join(', '),
          album: item.track.album.name,
          albumArt: item.track.album.images[0]?.url || 'https://via.placeholder.com/200/5B21B6/FFFFFF?text=No+Image'
        }));
        
        setRecentSongs(formattedTracks);
        setError(null);
      } catch (err) {
        console.error('Error fetching recently played:', err);
        setError(err.message || 'Failed to load recently played tracks');
      } finally {
        setLoading(false);
      }
    }

    fetchRecentlyPlayed();
  }, []);

  return (
    <div className="w-full bg-gradient-to-br from-fuchsia-900 via-pink-950 to-black rounded-2xl shadow-2xl p-5 sm:p-8 lg:p-10 border border-fuchsia-800/30">
      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-4 sm:mb-6">Recently Played</h2>
      
      {/* Loading state */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fuchsia-400"></div>
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="text-center py-12">
          <p className="text-fuchsia-300 text-lg">{error}</p>
        </div>
      )}

      {/* Tracks display */}
      {!loading && !error && recentSongs.length > 0 && (
        <div className="relative">
          {/* Scrollable container */}
          <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-fuchsia-700 scrollbar-track-fuchsia-950">
            {recentSongs.map((song) => (
              <SongCard key={song.id} song={song} />
            ))}
          </div>
        </div>
      )}

      {/* No tracks state */}
      {!loading && !error && recentSongs.length === 0 && (
        <div className="text-center py-12">
          <p className="text-fuchsia-300 text-lg">No recently played tracks found</p>
        </div>
      )}
    </div>
  );
}

export default RecentlyPlayed;
