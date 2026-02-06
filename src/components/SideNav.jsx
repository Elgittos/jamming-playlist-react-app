import { useEffect, useMemo, useState } from 'react';

const THEME_STORAGE_KEY = 'jp_theme_v1';

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

function Icon({ children }) {
  return (
    <span className="grid place-items-center w-10 h-10 rounded-xl bg-white/5 border border-white/10">
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

  const isLight = theme === 'light';

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
    ? 'bg-white/85 text-zinc-900 border border-zinc-200'
    : 'bg-gradient-to-b from-zinc-950/90 via-black/85 to-black/80 text-white border border-white/10';

  const itemBase = 'w-full flex items-center gap-3 rounded-xl px-2 py-1.5 md:px-1 md:py-1.5 transition-colors';
  const itemHover = isLight ? 'hover:bg-zinc-100' : 'hover:bg-white/10';

  return (
    <>
      {/* Mobile hamburger */}
      <button
        type="button"
        onClick={() => setIsMobileOpen(true)}
        className={`fixed top-4 left-4 z-[60] md:hidden inline-flex items-center justify-center w-11 h-11 rounded-2xl shadow-2xl ${isLight ? 'bg-white/90 text-zinc-900 border border-zinc-200' : 'bg-black/40 text-white border border-white/10'} backdrop-blur`}
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
          `fixed inset-y-0 left-0 z-[55] ${panelClasses} backdrop-blur md:group/nav ` +
          `transition-transform duration-200 md:translate-x-0 ` +
          `${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} ` +
          // width behavior
          `w-72 md:w-14 md:hover:w-56 md:overflow-visible overflow-hidden`
        }
        aria-label="Primary"
      >
        <div className="h-full flex flex-col py-3">
          {/* Top header */}
          <div className="px-3 md:px-2 flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className={`w-10 h-10 rounded-xl grid place-items-center ${isLight ? 'bg-fuchsia-100 text-fuchsia-700' : 'bg-fuchsia-600/20 text-fuchsia-200'} border ${isLight ? 'border-fuchsia-200' : 'border-fuchsia-500/20'}`}>
                <span className="font-black">JP</span>
              </div>
              <div className="hidden md:block md:opacity-0 md:group-hover/nav:opacity-100 md:transition-opacity md:duration-150 min-w-0">
                <div className="font-bold truncate">Jamming</div>
                <div className={`text-xs truncate ${isLight ? 'text-zinc-500' : 'text-white/60'}`}>Menu</div>
              </div>
            </div>

            <button
              type="button"
              onClick={closeMobile}
              className={`md:hidden inline-flex items-center justify-center w-10 h-10 rounded-xl ${isLight ? 'hover:bg-zinc-100' : 'hover:bg-white/10'}`}
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
                <Icon>{items[0].icon}</Icon>
                <span className="hidden md:block md:opacity-0 md:group-hover/nav:opacity-100 md:transition-opacity md:duration-150 font-semibold truncate">
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
                  `absolute left-full top-0 ml-2 w-44 rounded-2xl shadow-2xl backdrop-blur ${panelClasses} ` +
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
                        `w-full flex items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold transition-colors ` +
                        (selected
                          ? (isLight ? 'bg-fuchsia-100 text-fuchsia-800' : 'bg-fuchsia-600/20 text-fuchsia-200')
                          : (isLight ? 'hover:bg-zinc-100' : 'hover:bg-white/10'))
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
              <Icon>{items[1].icon}</Icon>
              <span className="hidden md:block md:opacity-0 md:group-hover/nav:opacity-100 md:transition-opacity md:duration-150 font-semibold truncate">
                Home
              </span>
              <span className="md:hidden font-semibold">Home</span>
            </button>
          </div>

          <div className="mt-auto px-3 md:px-2">
            <div className={`text-[11px] ${isLight ? 'text-zinc-500' : 'text-white/50'} hidden md:block md:opacity-0 md:group-hover/nav:opacity-100 md:transition-opacity md:duration-150`}>
              {theme === 'original' ? 'Original theme' : theme === 'dark' ? 'Dark theme' : 'Light theme'}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
