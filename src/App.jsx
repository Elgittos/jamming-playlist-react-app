import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import RecentlyPlayed from './components/RecentlyPlayed'
import YourPlaylist from './components/YourPlaylist'
import PlayingNow from './components/PlayingNow'
import SearchBar from './components/SearchBar'
import GenreSection from './components/GenreSection'
import SpotifyPlayer from './components/SpotifyPlayer'
import PlaylistsMenu from './components/PlaylistsMenu'
import SideNav from './components/SideNav'

const THEME_STORAGE_KEY = 'jp_theme_v1';

function App() {
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem(THEME_STORAGE_KEY) || 'original';
    } catch {
      return 'original';
    }
  });
  const [homeResetSignal, setHomeResetSignal] = useState(0);

  const handlePlaylistSelect = (playlistId) => {
    setSelectedPlaylistId(playlistId);
  };

  const isLight = theme === 'light';

  useEffect(() => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // ignore
    }
  }, [theme]);

  const appBgClasses = useMemo(() => {
    if (theme === 'dark') return 'bg-gradient-to-br from-zinc-950 via-black to-black';
    if (theme === 'light') return 'bg-gradient-to-br from-zinc-100 via-white to-zinc-200';
    return 'bg-gradient-to-br from-purple-950 via-violet-950 to-black';
  }, [theme]);

  const headerClasses = useMemo(() => {
    if (theme === 'dark') {
      return 'bg-gradient-to-r from-zinc-950/95 via-zinc-900/90 to-black/95 border border-white/20 backdrop-blur-xl shadow-2xl shadow-black/40';
    }
    if (theme === 'light') {
      return 'bg-white/90 border border-zinc-300/60 backdrop-blur-xl shadow-2xl shadow-zinc-300/20';
    }
    return 'bg-gradient-to-r from-indigo-950 via-indigo-900 to-purple-900 border border-indigo-800/30';
  }, [theme]);

  const handleHome = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    setHomeResetSignal((v) => v + 1);
  };

  return (

    <main className={`min-h-screen ${appBgClasses} ${isLight ? 'text-zinc-900' : 'text-white'}`}>
      <SideNav
        theme={theme}
        onThemeChange={setTheme}
        onHome={handleHome}
      />

      <div className="mx-auto w-full max-w-7xl 2xl:max-w-screen-2xl flex flex-col gap-3 sm:gap-4 p-3 sm:p-4 md:p-5 lg:p-6">
        {/* Spotify Web Player */}
        <SpotifyPlayer />

        {/* Header */}
        <div className={`${headerClasses} p-3 sm:p-4 lg:p-5 rounded-2xl`}> 
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 lg:gap-6">
            <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight ${isLight ? 'text-zinc-900' : 'text-white'}`}>
              🎵 Jamming Playlist App
            </h1>

            {/* Search Bar */}
            <div className="w-full lg:flex-1 lg:max-w-2xl">
              <SearchBar theme={theme} resetSignal={homeResetSignal} />
            </div>

            <Link
              to="/test"
              className="w-full sm:w-auto text-center bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 px-6 rounded-full transition-all shadow-lg hover:shadow-yellow-500/50"
            >
              Test Login
            </Link>
          </div>
        </div>

        {/* Playlists Strip (top context) */}
        <PlaylistsMenu
          onPlaylistSelect={handlePlaylistSelect}
          selectedPlaylistId={selectedPlaylistId}
          theme={theme}
        />

        {/* Playback + playlist content (Playing Now prioritized) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 w-full lg:min-h-[520px]">
          <div className="lg:col-span-2">
            <PlayingNow theme={theme} />
          </div>
          <div className="lg:col-span-1">
            <YourPlaylist selectedPlaylistId={selectedPlaylistId} theme={theme} />
          </div>
        </div>

        <RecentlyPlayed theme={theme} />

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
