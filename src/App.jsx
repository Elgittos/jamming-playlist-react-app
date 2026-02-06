import { useState } from 'react'
import { Link } from 'react-router-dom'
import RecentlyPlayed from './components/RecentlyPlayed'
import YourPlaylist from './components/YourPlaylist'
import PlayingNow from './components/PlayingNow'
import SearchBar from './components/SearchBar'
import GenreSection from './components/GenreSection'
import SpotifyPlayer from './components/SpotifyPlayer'
import PlaylistsMenu from './components/PlaylistsMenu'

function App() {
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);

  const handlePlaylistSelect = (playlistId) => {
    setSelectedPlaylistId(playlistId);
  };

  return (

    <main className="min-h-screen bg-gradient-to-br from-purple-950 via-violet-950 to-black">
      <div className="mx-auto w-full max-w-7xl 2xl:max-w-screen-2xl flex flex-col gap-4 sm:gap-5 p-3 md:p-4 lg:p-5">
        {/* Spotify Web Player */}
        <SpotifyPlayer />

        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-950 via-indigo-900 to-purple-900 p-4 sm:p-6 rounded-2xl shadow-2xl">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-3 lg:gap-5">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight">
              🎵 Jamming Playlist App
            </h1>

            {/* Search Bar */}
            <div className="w-full lg:flex-1 lg:max-w-2xl">
              <SearchBar />
            </div>

            <Link
              to="/test"
              className="w-full sm:w-auto text-center bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-2.5 px-5 rounded-full transition-all shadow-lg hover:shadow-yellow-500/50"
            >
              Test Login
            </Link>
          </div>
        </div>

        <RecentlyPlayed />

        {/* Playlists Menu */}
        <PlaylistsMenu
          onPlaylistSelect={handlePlaylistSelect}
          selectedPlaylistId={selectedPlaylistId}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 w-full lg:min-h-[600px]">
          <YourPlaylist selectedPlaylistId={selectedPlaylistId} />
          <PlayingNow />
        </div>

        {/* Genre Sections */}
        <GenreSection genre="Pop" gradientFrom="from-pink-900" gradientVia="via-rose-900" gradientTo="to-pink-950" />
        <GenreSection genre="Rap" gradientFrom="from-orange-900" gradientVia="via-amber-900" gradientTo="to-orange-950" />
        <GenreSection genre="Rock" gradientFrom="from-red-900" gradientVia="via-rose-950" gradientTo="to-red-950" />
        <GenreSection genre="Disco" gradientFrom="from-cyan-900" gradientVia="via-blue-900" gradientTo="to-cyan-950" />
        <GenreSection genre="Bachata" gradientFrom="from-emerald-900" gradientVia="via-teal-900" gradientTo="to-emerald-950" />
      </div>
    </main>
  )
}

export default App
