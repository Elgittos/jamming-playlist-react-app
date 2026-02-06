import { usePlayer } from '../contexts/PlayerContext';

function SongCard({ song }) {
  const { playTrack } = usePlayer();

  const handlePlay = async () => {
    if (song.uri) {
      try {
        await playTrack(song.uri, song);
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
      className="bg-gradient-to-br from-violet-800 to-purple-900 p-2.5 sm:p-3 rounded-xl w-[150px] sm:w-[170px] lg:w-[190px] h-[220px] sm:h-[240px] lg:h-[260px] flex-shrink-0 hover:from-violet-700 hover:to-purple-800 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-purple-500/50 hover:scale-105 border border-violet-700/30 flex flex-col"
    >
      <img 
        src={song.albumArt} 
        alt={song.title} 
        className="w-full h-[110px] sm:h-[130px] lg:h-[150px] object-cover rounded-lg mb-2.5 shadow-md"
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
