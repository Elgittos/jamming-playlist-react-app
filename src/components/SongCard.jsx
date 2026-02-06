import { usePlayer } from '../hooks/usePlayer';

function SongCard({ song, compact = false }) {
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

  const cardSize = compact
    ? 'w-[136px] sm:w-[150px] h-[184px] sm:h-[198px]'
    : 'w-[150px] sm:w-[170px] lg:w-[190px] h-[210px] sm:h-[230px] lg:h-[250px]';

  const imageSize = compact
    ? 'h-[98px] sm:h-[108px]'
    : 'h-[105px] sm:h-[120px] lg:h-[135px]';

  return (
    <div 
      onClick={handlePlay}
      className={`song-card bg-gradient-to-br from-fuchsia-900 to-indigo-950 p-2.5 sm:p-3 rounded-xl ${cardSize} flex-shrink-0 hover:from-fuchsia-800 hover:to-indigo-900 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-fuchsia-500/30 hover:scale-[1.02] border border-white/10 flex flex-col`}
    >
      <img 
        src={song.albumArt} 
        alt={song.title} 
        className={`w-full ${imageSize} object-cover rounded-lg mb-2 shadow-md`}
      />
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-semibold text-white truncate text-xs sm:text-sm leading-tight mb-0.5">{song.title}</h3>
          <p className="text-[11px] sm:text-xs text-gray-300 truncate">{song.artist}</p>
        </div>
        <p className="text-[11px] sm:text-xs text-gray-400 truncate mt-1">{song.album}</p>
      </div>
    </div>
  );
}

export default SongCard;


