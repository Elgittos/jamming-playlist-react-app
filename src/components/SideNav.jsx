import { useEffect, useMemo, useState } from 'react';

const THEME_STORAGE_KEY = 'jp_theme_v1';
const PIN_STORAGE_KEY = 'jp_nav_pinned_v1';

function useIsHoverCapable() {
  const [isHoverCapable, setIsHoverCapable] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia?.('(hover: hover) and (pointer: fine)');
    if (!mq) return;

    const update = () => setIsHoverCapable(Boolean(mq.matches));
    update();

    // Safari uses addListener/removeListener
    if (mq.addEventListener) {
      mq.addEventListener('change', update);
      return () => mq.removeEventListener('change', update);
    }

    mq.addListener(update);
    return () => mq.removeListener(update);
  }, []);

  return isHoverCapable;
}

function Icon({ children, isLight }) {
  return (
    <span className={`grid place-items-center w-10 h-10 rounded-xl transition-all ${
      isLight 
        ? 'bg-zinc-100/80 border border-zinc-300/50 backdrop-blur-sm shadow-sm' 
        : 'bg-white/10 border border-white/20 backdrop-blur-sm shadow-lg shadow-white/5'
    }`}>
      {children}
    </span>
  );
}

export default function SideNav({
  theme,
  onThemeChange,
  onHome
}) {
  const isHoverCapable = useIsHoverCapable();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isThemesOpenMobile, setIsThemesOpenMobile] = useState(false);
  const [isPinned, setIsPinned] = useState(() => {
    try {
      return localStorage.getItem(PIN_STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const isLight = theme === 'light';

  useEffect(() => {
    try {
      localStorage.setItem(PIN_STORAGE_KEY, isPinned.toString());
    } catch {
      // ignore
    }
  }, [isPinned]);

  const closeMobile = () => {
    setIsMobileOpen(false);
    setIsThemesOpenMobile(false);
  };

  const handleHome = () => {
    closeMobile();
    onHome?.();
  };

  const items = useMemo(
    () => [
      {
        key: 'themes',
        label: 'Themes',
        icon: (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364-6.364l-1.414 1.414M7.05 16.95l-1.414 1.414m12.728 0l-1.414-1.414M7.05 7.05 5.636 5.636" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a6 6 0 100-12 6 6 0 000 12z" />
          </svg>
        )
      },
      {
        key: 'home',
        label: 'Home',
        icon: (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 11.5l9-8 9 8" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 10.5V20a1 1 0 001 1h4v-6h4v6h4a1 1 0 001-1v-9.5" />
          </svg>
        )
      }
    ],
    []
  );

  const panelClasses = isLight
    ? 'bg-white/90 text-zinc-900 border border-zinc-300/60 backdrop-blur-xl shadow-2xl shadow-zinc-300/20'
    : 'bg-gradient-to-b from-zinc-950/95 via-black/90 to-black/85 text-white border border-white/20 backdrop-blur-xl shadow-2xl shadow-black/40';

  const itemBase = 'w-full flex items-center gap-3 rounded-xl px-2 py-1.5 md:px-1 md:py-1.5 transition-all duration-200';
  const itemHover = isLight 
    ? 'hover:bg-zinc-200/60 hover:shadow-md' 
    : 'hover:bg-white/15 hover:shadow-lg hover:shadow-white/5';

  const togglePin = () => {
    setIsPinned((v) => !v);
  };

  const isExpanded = isPinned || isMobileOpen;

  return (
    <>
      {/* Mobile hamburger */}
      <button
        type="button"
        onClick={() => setIsMobileOpen(true)}
        className={`fixed top-4 left-4 z-[60] md:hidden inline-flex items-center justify-center w-11 h-11 rounded-2xl shadow-2xl ${
          isLight 
            ? 'bg-white/95 text-zinc-900 border border-zinc-300/60 backdrop-blur-xl shadow-zinc-300/30' 
            : 'bg-black/60 text-white border border-white/20 backdrop-blur-xl shadow-black/50'
        }`}
        aria-label="Open menu"
      >
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      </button>

      {/* Backdrop (mobile only) */}
      {isMobileOpen && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-50 md:hidden bg-black/50"
          onClick={closeMobile}
        />
      )}

      {/* Nav rail */}
      <nav
        className={
          `fixed inset-y-0 left-0 z-[55] ${panelClasses} md:group/nav ` +
          `transition-transform duration-200 md:translate-x-0 ` +
          `${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} ` +
          // width behavior - fixed when pinned or on hover
          `w-72 md:w-14 ${isPinned ? 'md:!w-56' : 'md:hover:w-56'} md:overflow-visible overflow-hidden ` +
          `md:transition-[width] md:duration-300 md:ease-in-out`
        }
        aria-label="Primary"
      >
        <div className="h-full flex flex-col py-3">
          {/* Top header */}
          <div className="px-3 md:px-2 flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className={`w-10 h-10 flex-shrink-0 rounded-xl grid place-items-center ${
                isLight 
                  ? 'bg-fuchsia-100 text-fuchsia-700 border border-fuchsia-300/50 shadow-sm' 
                  : 'bg-fuchsia-600/30 text-fuchsia-200 border border-fuchsia-500/30 shadow-lg shadow-fuchsia-500/10'
              }`}>
                <span className="font-black">JP</span>
              </div>
              <div className={`hidden md:block min-w-0 transition-opacity duration-200 ${
                isPinned ? 'md:opacity-100' : 'md:opacity-0 md:group-hover/nav:opacity-100'
              }`}>
                <div className="font-bold truncate">Jamming</div>
                <div className={`text-xs truncate ${isLight ? 'text-zinc-500' : 'text-white/60'}`}>Menu</div>
              </div>
            </div>

            {/* Pin button (desktop only) */}
            <button
              type="button"
              onClick={togglePin}
              className={`hidden md:inline-flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 ${
                isPinned ? 'md:opacity-100' : 'md:opacity-0 md:group-hover/nav:opacity-100'
              } ${
                isLight 
                  ? 'hover:bg-zinc-200/80 text-zinc-700' 
                  : 'hover:bg-white/15 text-white/80'
              }`}
              aria-label={isPinned ? 'Unpin menu' : 'Pin menu'}
              title={isPinned ? 'Unpin menu' : 'Pin menu'}
            >
              <svg 
                className={`w-4 h-4 transition-transform duration-300 ${isPinned ? 'rotate-45' : 'rotate-0'}`} 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  d="M5 12h14M12 5l7 7-7 7" 
                  className={isPinned ? 'opacity-100' : 'opacity-60'}
                />
              </svg>
            </button>

            {/* Mobile close button */}
            <button
              type="button"
              onClick={closeMobile}
              className={`md:hidden inline-flex items-center justify-center w-10 h-10 rounded-xl ${
                isLight ? 'hover:bg-zinc-200/80' : 'hover:bg-white/15'
              }`}
              aria-label="Close menu"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" d="M6 6l12 12M18 6l-12 12" />
              </svg>
            </button>
          </div>

          <div className="mt-3 px-2 md:px-1 flex flex-col gap-1">
            {/* Themes item (submenu) */}
            <div className={`relative ${isHoverCapable ? 'group/themes' : ''}`}>
              <button
                type="button"
                onClick={() => {
                  if (!isHoverCapable) {
                    setIsThemesOpenMobile((v) => !v);
                  }
                }}
                className={`${itemBase} ${itemHover}`}
                aria-haspopup="menu"
                aria-expanded={isHoverCapable ? undefined : isThemesOpenMobile}
              >
                <Icon isLight={isLight}>{items[0].icon}</Icon>
                <span className={`font-semibold truncate transition-opacity duration-200 ${
                  isPinned ? 'md:opacity-100' : 'md:opacity-0 md:group-hover/nav:opacity-100'
                } hidden md:inline`}>
                  Themes
                </span>
                <span className="md:hidden font-semibold">Themes</span>
                <span className="ml-auto md:hidden">
                  <svg className={`w-4 h-4 transition-transform ${isThemesOpenMobile ? 'rotate-90' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </button>

              <div
                className={
                  `absolute left-full top-0 ml-2 w-44 rounded-2xl shadow-2xl ${panelClasses} ` +
                  `p-2 ${isHoverCapable ? 'hidden group-hover/themes:block' : (isThemesOpenMobile ? 'block' : 'hidden')}`
                }
                role="menu"
              >
                {[
                  { key: 'dark', label: 'Dark' },
                  { key: 'light', label: 'Light' },
                  { key: 'original', label: 'Original' }
                ].map((opt) => {
                  const selected = theme === opt.key;
                  return (
                    <button
                      key={opt.key}
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        try {
                          localStorage.setItem(THEME_STORAGE_KEY, opt.key);
                        } catch {
                          // ignore
                        }
                        onThemeChange?.(opt.key);
                        if (!isHoverCapable) setIsThemesOpenMobile(false);
                      }}
                      className={
                        `w-full flex items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold transition-all duration-200 ` +
                        (selected
                          ? (isLight 
                            ? 'bg-fuchsia-100 text-fuchsia-800 border border-fuchsia-200 shadow-md' 
                            : 'bg-fuchsia-600/30 text-fuchsia-200 border border-fuchsia-500/30 shadow-lg shadow-fuchsia-500/10')
                          : (isLight ? 'hover:bg-zinc-200/60' : 'hover:bg-white/15'))
                      }
                    >
                      <span>{opt.label}</span>
                      {selected && (
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M20 6L9 17l-5-5" />
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Home */}
            <button
              type="button"
              onClick={handleHome}
              className={`${itemBase} ${itemHover}`}
            >
              <Icon isLight={isLight}>{items[1].icon}</Icon>
              <span className={`font-semibold truncate transition-opacity duration-200 ${
                isPinned ? 'md:opacity-100' : 'md:opacity-0 md:group-hover/nav:opacity-100'
              } hidden md:inline`}>
                Home
              </span>
              <span className="md:hidden font-semibold">Home</span>
            </button>
          </div>

          <div className="mt-auto px-3 md:px-2">
            <div className={`text-[11px] ${
              isLight ? 'text-zinc-500' : 'text-white/60'
            } transition-opacity duration-200 ${
              isPinned ? 'md:opacity-100' : 'md:opacity-0 md:group-hover/nav:opacity-100'
            } hidden md:block`}>
              {theme === 'original' ? 'Original theme' : theme === 'dark' ? 'Dark theme' : 'Light theme'}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
