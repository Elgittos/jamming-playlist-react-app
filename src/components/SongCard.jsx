function SongCard({ song }) {
  return (
    <div className="bg-violet-800 p-4 rounded-lg min-w-[200px] flex-shrink-0 hover:bg-violet-700 transition-colors cursor-pointer">
      <img 
        src={song.albumArt} 
        alt={song.title} 
        className="w-full h-40 object-cover rounded-lg mb-3"
      />
      <h3 className="font-semibold text-white truncate">{song.title}</h3>
      <p className="text-sm text-gray-300 truncate">{song.artist}</p>
      <p className="text-xs text-gray-400 mt-1">{song.album}</p>
    </div>
  );
}

export default SongCard;
