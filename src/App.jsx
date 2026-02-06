import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import RecentlyPlayed from './components/RecentlyPlayed'
import YourPlaylist from './components/YourPlaylist'
import PlayingNow from './components/PlayingNow'
import SearchBar from './components/SearchBar'
import GenreSection from './components/GenreSection'
import SpotifyPlayer from './components/SpotifyPlayer'
import PlaylistsMenu from './components/PlaylistsMenu'
import LeftMenu from './components/LeftMenu'

function App() {
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);
  const [theme, setTheme] = useState('original');

  // Load theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('app_theme');
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  // Apply theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('app_theme', theme);
  }, [theme]);

  const handlePlaylistSelect = (playlistId) => {
    setSelectedPlaylistId(playlistId);
  };

  const handleHomeClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setSelectedPlaylistId(null);
  };

  return (
    <>
      <LeftMenu theme={theme} onThemeChange={setTheme} onHomeClick={handleHomeClick} />
      
      <main className="min-h-screen theme-bg transition-colors duration-300">
        <div className="mx-auto w-full max-w-7xl 2xl:max-w-screen-2xl flex flex-col gap-3 sm:gap-4 p-4 md:p-5 lg:p-6 lg:pl-20">
          {/* Spotify Web Player */}
          <SpotifyPlayer />

          {/* Playlists Horizontal Strip */}
          <PlaylistsMenu
            onPlaylistSelect={handlePlaylistSelect}
            selectedPlaylistId={selectedPlaylistId}
          />

          {/* Compact Header */}
          <div className="theme-card p-3 sm:p-4 rounded-xl shadow-xl">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
                🎵 Jamming Playlist App
              </h1>

              {/* Search Bar */}
              <div className="w-full sm:flex-1 sm:max-w-md lg:max-w-lg">
                <SearchBar />
              </div>

              <Link
                to="/test"
                className="w-full sm:w-auto text-center bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-2 px-5 rounded-full transition-all shadow-lg hover:shadow-yellow-500/50 text-sm"
              >
                Test Login
              </Link>
            </div>
          </div>

          {/* Playing Now - Main Focus */}
          <PlayingNow />

          <RecentlyPlayed />

          <div className="w-full">
            <YourPlaylist selectedPlaylistId={selectedPlaylistId} />
          </div>

        {/* Genre Sections */}
        <GenreSection genre="Pop" gradientFrom="from-pink-900" gradientVia="via-rose-900" gradientTo="to-pink-950" />
        <GenreSection genre="Rap" gradientFrom="from-orange-900" gradientVia="via-amber-900" gradientTo="to-orange-950" />
        <GenreSection genre="Rock" gradientFrom="from-red-900" gradientVia="via-rose-950" gradientTo="to-red-950" />
        <GenreSection genre="Disco" gradientFrom="from-cyan-900" gradientVia="via-blue-900" gradientTo="to-cyan-950" />
        <GenreSection genre="Bachata" gradientFrom="from-emerald-900" gradientVia="via-teal-900" gradientTo="to-emerald-950" />
      </div>
    </main>
    </>
  )
}

export default App
