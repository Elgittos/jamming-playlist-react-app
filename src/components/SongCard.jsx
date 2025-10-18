function SongCard({ song }) {
  return (
    <div className="bg-gradient-to-br from-violet-800 to-purple-900 p-4 rounded-xl w-[200px] h-[280px] flex-shrink-0 hover:from-violet-700 hover:to-purple-800 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-purple-500/50 hover:scale-105 border border-violet-700/30 flex flex-col">
      <img 
        src={song.albumArt} 
        alt={song.title} 
        className="w-full h-[160px] object-cover rounded-lg mb-3 shadow-md"
      />
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-semibold text-white truncate text-sm leading-tight mb-1">{song.title}</h3>
          <p className="text-xs text-gray-300 truncate">{song.artist}</p>
        </div>
        <p className="text-xs text-gray-400 truncate mt-auto">{song.album}</p>
      </div>
    </div>
  );
}

export default SongCard;
