import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import RecentlyPlayed from './components/RecentlyPlayed'
import PlayingNow from './components/PlayingNow'
import SearchBar from './components/SearchBar'
import GenreSection from './components/GenreSection'
import SpotifyPlayer from './components/SpotifyPlayer'
import SideMenu from './components/SideMenu'

const THEME_STORAGE_KEY = 'jp_theme_v1'
const VALID_THEMES = new Set(['dark', 'light', 'original'])

function App() {
  const [searchResetSignal, setSearchResetSignal] = useState(0)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const mobileMenuRef = useRef(null)
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'original'
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY)
    return VALID_THEMES.has(storedTheme) ? storedTheme : 'original'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  }, [theme])

  const handleHome = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setSearchResetSignal((prev) => prev + 1)
  }

  useEffect(() => {
    if (!isMobileMenuOpen) return

    const onDocPointerDown = (event) => {
      if (!mobileMenuRef.current) return
      if (!mobileMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false)
      }
    }

    document.addEventListener('pointerdown', onDocPointerDown)
    return () => document.removeEventListener('pointerdown', onDocPointerDown)
  }, [isMobileMenuOpen])

  const handleThemeChange = (nextTheme) => {
    setTheme(nextTheme)
    setIsMobileMenuOpen(false)
  }

  const handleNavigate = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <main className="app-bg min-h-screen">
      <div className="mx-auto w-full max-w-7xl 2xl:max-w-screen-2xl px-3 py-4 sm:px-4 sm:py-5 lg:px-6 lg:py-6">
        <div className="flex flex-col items-stretch gap-3 sm:gap-4 lg:flex-row lg:items-start">
          <div className="shrink-0 hidden lg:block">
            <SideMenu theme={theme} onThemeChange={handleThemeChange} onHome={handleHome} />
          </div>

          <div className="min-w-0 flex-1 flex flex-col gap-3 sm:gap-4">
            <SpotifyPlayer />

            <header id="home-top" className="surface-panel rounded-2xl p-3 sm:p-4 relative z-20">
              <div className="flex flex-col gap-3 lg:grid lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-center lg:gap-4">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight tracking-tight">
                  Jamming Playlist App
                </h1>

                <div className="w-full">
                  <SearchBar resetSignal={searchResetSignal} />
                </div>

                <div ref={mobileMenuRef} className="relative flex w-full items-center justify-end gap-2 sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                    className="lg:hidden inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition-colors hover:bg-white/10"
                    aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                    aria-expanded={isMobileMenuOpen}
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      {isMobileMenuOpen ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M6 6l12 12M18 6L6 18" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M4 7h16M4 12h16M4 17h16" />
                      )}
                    </svg>
                  </button>

                  {isMobileMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-72 max-w-[calc(100vw-1.5rem)] z-[120]">
                      <SideMenu
                        theme={theme}
                        onThemeChange={handleThemeChange}
                        onHome={() => {
                          handleHome()
                          handleNavigate()
                        }}
                        onNavigate={handleNavigate}
                      />
                    </div>
                  )}

                  <Link
                    to="/test"
                    className="w-full sm:w-auto text-center bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-2.5 px-5 rounded-full transition-all shadow-lg hover:shadow-yellow-500/40"
                  >
                    Test Login
                  </Link>
                </div>
              </div>
            </header>

            <section className="grid grid-cols-1 items-start gap-3 xl:grid-cols-[minmax(320px,1fr)_minmax(420px,1.35fr)] sm:gap-4">
              <div className="order-2 xl:order-1">
                <RecentlyPlayed compact />
              </div>
              <div id="playing-now" className="order-1 xl:order-2">
                <PlayingNow />
              </div>
            </section>

            <section className="grid grid-cols-1 gap-3 sm:gap-4">
              <GenreSection genre="Pop" gradientFrom="from-rose-950" gradientVia="via-fuchsia-900" gradientTo="to-slate-950" compact />
              <GenreSection genre="Rap" gradientFrom="from-orange-950" gradientVia="via-amber-900" gradientTo="to-zinc-950" compact />
              <GenreSection genre="Rock" gradientFrom="from-emerald-950" gradientVia="via-teal-900" gradientTo="to-slate-950" compact />
              <GenreSection genre="Disco" gradientFrom="from-indigo-950" gradientVia="via-purple-900" gradientTo="to-slate-950" compact />
              <GenreSection genre="Bachata" gradientFrom="from-fuchsia-950" gradientVia="via-purple-900" gradientTo="to-zinc-950" compact />
            </section>
          </div>
        </div>
      </div>
    </main>
  )
}

export default App

