import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import RecentlyPlayed from './components/RecentlyPlayed'
import YourPlaylist from './components/YourPlaylist'
import PlayingNow from './components/PlayingNow'
import SearchBar from './components/SearchBar'
import GenreSection from './components/GenreSection'
import SpotifyPlayer from './components/SpotifyPlayer'
import PlaylistsMenu from './components/PlaylistsMenu'
import SideMenu from './components/SideMenu'

const THEME_STORAGE_KEY = 'jp_theme_v1'
const VALID_THEMES = new Set(['dark', 'light', 'original', 'vibrant'])

function App() {
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null)
  const [searchResetSignal, setSearchResetSignal] = useState(0)
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'original'
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY)
    return VALID_THEMES.has(storedTheme) ? storedTheme : 'original'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  }, [theme])

  const handlePlaylistSelect = (playlistId) => {
    setSelectedPlaylistId(playlistId)
  }

  const handleHome = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setSearchResetSignal((prev) => prev + 1)
  }

  return (
    <main className="app-bg min-h-screen text-white">
      <SideMenu theme={theme} onThemeChange={setTheme} onHome={handleHome} />

      <div className="mx-auto w-full max-w-7xl 2xl:max-w-screen-2xl flex flex-col gap-3 px-3 py-4 sm:gap-4 sm:px-4 sm:py-5 lg:px-6 lg:py-6 lg:pl-64">
        <SpotifyPlayer />

        <header id="home-top" className="surface-panel rounded-2xl p-3 sm:p-4">
          <div className="flex flex-col gap-3 lg:grid lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-center lg:gap-4">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight tracking-tight">
              Jamming Playlist App
            </h1>

            <div className="w-full">
              <SearchBar resetSignal={searchResetSignal} />
            </div>

            <Link
              to="/test"
              className="w-full sm:w-auto text-center bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-2.5 px-5 rounded-full transition-all shadow-lg hover:shadow-yellow-500/40"
            >
              Test Login
            </Link>
          </div>
        </header>

        <section id="playlist-strip">
          <PlaylistsMenu
            onPlaylistSelect={handlePlaylistSelect}
            selectedPlaylistId={selectedPlaylistId}
          />
        </section>

        <section className="grid grid-cols-1 items-start gap-3 xl:grid-cols-[minmax(280px,1fr)_minmax(380px,1.35fr)_minmax(260px,1fr)] sm:gap-4">
          <div className="order-2 xl:order-1">
            <YourPlaylist selectedPlaylistId={selectedPlaylistId} />
          </div>
          <div id="playing-now" className="order-1 xl:order-2">
            <PlayingNow />
          </div>
          <div className="order-3 xl:order-3">
            <RecentlyPlayed compact />
          </div>
        </section>

        <section className="grid grid-cols-1 gap-3 sm:gap-4">
          <GenreSection genre="Pop" gradientFrom="from-cyan-900" gradientVia="via-sky-900" gradientTo="to-slate-950" compact />
          <GenreSection genre="Rap" gradientFrom="from-teal-900" gradientVia="via-cyan-900" gradientTo="to-slate-950" compact />
          <GenreSection genre="Rock" gradientFrom="from-amber-900" gradientVia="via-orange-900" gradientTo="to-zinc-950" compact />
          <GenreSection genre="Disco" gradientFrom="from-lime-900" gradientVia="via-teal-900" gradientTo="to-slate-950" compact />
          <GenreSection genre="Bachata" gradientFrom="from-rose-900" gradientVia="via-orange-900" gradientTo="to-zinc-950" compact />
        </section>
      </div>
    </main>
  )
}

export default App

