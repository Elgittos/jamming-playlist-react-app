import SongCard from './SongCard';

function RecentlyPlayed() {
  // Mock data - replace with real data from Spotify API later
  const recentSongs = [
    {
      id: 1,
      title: "Blinding Lights",
      artist: "The Weeknd",
      album: "After Hours",
      albumArt: "https://via.placeholder.com/200/5B21B6/FFFFFF?text=Album+1"
    },
    {
      id: 2,
      title: "Levitating",
      artist: "Dua Lipa",
      album: "Future Nostalgia",
      albumArt: "https://via.placeholder.com/200/7C3AED/FFFFFF?text=Album+2"
    },
    {
      id: 3,
      title: "Save Your Tears",
      artist: "The Weeknd",
      album: "After Hours",
      albumArt: "https://via.placeholder.com/200/8B5CF6/FFFFFF?text=Album+3"
    },
    {
      id: 4,
      title: "Peaches",
      artist: "Justin Bieber",
      album: "Justice",
      albumArt: "https://via.placeholder.com/200/A78BFA/FFFFFF?text=Album+4"
    },
    {
      id: 5,
      title: "Good 4 U",
      artist: "Olivia Rodrigo",
      album: "SOUR",
      albumArt: "https://via.placeholder.com/200/C4B5FD/FFFFFF?text=Album+5"
    }
  ];

  return (
    <div className="bg-fuchsia-950 p-6">
      <h2 className="text-2xl font-bold text-white mb-4">Recently Played</h2>
      
      {/* Horizontal scrolling container */}
      <div className="flex gap-4 overflow-x-auto pb-4 scroll-smooth">
        {recentSongs.map((song) => (
          <SongCard key={song.id} song={song} />
        ))}
      </div>
    </div>
  );
}

export default RecentlyPlayed;
