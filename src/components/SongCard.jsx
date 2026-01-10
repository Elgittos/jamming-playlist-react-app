import { playTrack } from '../api';

function SongCard({ song }) {
  const handlePlay = async () => {
    if (song.uri) {
      try {
        await playTrack(song.uri);
        console.log('Playing:', song.title);
      } catch (error) {
        console.error('Failed to play track:', error);
        alert(error.message || 'Failed to play track. Make sure Spotify is open on a device.');
      }
    }
  };

  return (
    <div 
      onClick={handlePlay}
      className="bg-gradient-to-br from-violet-800 to-purple-900 p-3 sm:p-4 rounded-xl w-[160px] sm:w-[180px] lg:w-[200px] h-[240px] sm:h-[260px] lg:h-[280px] flex-shrink-0 hover:from-violet-700 hover:to-purple-800 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-purple-500/50 hover:scale-105 border border-violet-700/30 flex flex-col"
    >
      <img 
        src={song.albumArt} 
        alt={song.title} 
        className="w-full h-[120px] sm:h-[140px] lg:h-[160px] object-cover rounded-lg mb-3 shadow-md"
      />
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-semibold text-white truncate text-xs sm:text-sm leading-tight mb-1">{song.title}</h3>
          <p className="text-[11px] sm:text-xs text-gray-300 truncate">{song.artist}</p>
        </div>
        <p className="text-[11px] sm:text-xs text-gray-400 truncate mt-auto">{song.album}</p>
      </div>
    </div>
  );
}

export default SongCard;
