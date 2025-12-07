import { useState } from 'react'
import { Link } from 'react-router-dom'
import RecentlyPlayed from './components/RecentlyPlayed'
import YourPlaylist from './components/YourPlaylist'
import PlayingNow from './components/PlayingNow'
import SearchBar from './components/SearchBar'
import GenreSection from './components/GenreSection'
import SpotifyPlayer from './components/SpotifyPlayer'
import PlaylistsMenu from './components/PlaylistsMenu'
import AudioSourceSelector from './components/AudioSourceSelector'

function App() {
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);

  const handlePlaylistSelect = (playlistId) => {
    setSelectedPlaylistId(playlistId);
  };

  return (

      <main className="min-h-screen bg-gradient-to-br from-purple-950 via-violet-950 to-black flex flex-col gap-8 p-4 md:p-6 lg:p-8">
        {/* Spotify Web Player */}
        <SpotifyPlayer />
        
        {/* Header with gradient and test button */}
        <div className="bg-gradient-to-r from-indigo-950 via-indigo-900 to-purple-900 p-4 md:p-6 lg:p-10 rounded-2xl shadow-2xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white">🎵 Jamming Playlist App</h1>
            
            {/* Search Bar - full width on mobile */}
            <div className="w-full md:flex-1 md:max-w-2xl">
              <SearchBar />
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto">
              {/* Audio Source Selector */}
              <AudioSourceSelector />
              
              <Link to="/test" className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-2 md:py-3 px-4 md:px-6 rounded-full transition-all shadow-lg hover:shadow-yellow-500/50 whitespace-nowrap text-center w-full sm:w-auto">
                Test Login
              </Link>
            </div>
          </div>
        </div>
          
        <RecentlyPlayed />

        {/* Playlists Menu */}
        <PlaylistsMenu 
          onPlaylistSelect={handlePlaylistSelect}
          selectedPlaylistId={selectedPlaylistId}
        />

        {/* Responsive two-column layout - stacks on mobile */}
        <div className="flex flex-col lg:flex-row gap-6 w-full min-h-[400px] lg:min-h-[600px]">
          <div className="w-full lg:w-1/2">
            <YourPlaylist selectedPlaylistId={selectedPlaylistId} />
          </div>
          <div className="w-full lg:w-1/2">
            <PlayingNow />
          </div>
        </div>

        {/* Genre Sections */}
        <GenreSection genre="Pop" gradientFrom="from-pink-900" gradientVia="via-rose-900" gradientTo="to-pink-950" />
        <GenreSection genre="Rap" gradientFrom="from-orange-900" gradientVia="via-amber-900" gradientTo="to-orange-950" />
        <GenreSection genre="Rock" gradientFrom="from-red-900" gradientVia="via-rose-950" gradientTo="to-red-950" />
        <GenreSection genre="Disco" gradientFrom="from-cyan-900" gradientVia="via-blue-900" gradientTo="to-cyan-950" />
        <GenreSection genre="Bachata" gradientFrom="from-emerald-900" gradientVia="via-teal-900" gradientTo="to-emerald-950" />
      </main>
  )
}

export default App
