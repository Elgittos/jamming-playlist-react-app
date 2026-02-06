import { useEffect, useMemo, useRef, useState } from 'react';
import { usePlayer } from '../hooks/usePlayer';

function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function PlayingNow() {
  const {
    isAuthed,
    playbackState,
    isPlaybackLoading,
    isPlaying,
    progressMs,
    durationMs,
    togglePlayPause,
    next,
    previous,
    seekToMs,
    recentlyPlayed,
    searchHistory
  } = usePlayer();

  const [isScrubbing, setIsScrubbing] = useState(false);
  const [scrubMs, setScrubMs] = useState(0);
  const progressBarRef = useRef(null);
  const activePointerIdRef = useRef(null);

  const displayProgressMs = isScrubbing ? scrubMs : progressMs;
  const progressPercent = useMemo(() => {
    if (!durationMs) return 0;
    return Math.max(0, Math.min(100, (displayProgressMs / durationMs) * 100));
  }, [displayProgressMs, durationMs]);

  const item = playbackState?.item;
  const releaseYear = item?.album?.release_date ? new Date(item.album.release_date).getFullYear() : null;
  const genre = item?.artists?.[0]?.genres?.[0];
  const playbackStatus = isPlaying ? 'Playing' : 'Paused';

  const getMsFromClientX = (clientX) => {
    const el = progressBarRef.current;
    if (!el || !durationMs) return 0;

    const rect = el.getBoundingClientRect();
    const ratio = (clientX - rect.left) / rect.width;
    const clampedRatio = Math.max(0, Math.min(1, ratio));
    return Math.round(clampedRatio * durationMs);
  };

  const handleScrubStart = (event) => {
    if (!durationMs) return;
    event.preventDefault();
    activePointerIdRef.current = event.pointerId;
    progressBarRef.current?.setPointerCapture?.(event.pointerId);
    setIsScrubbing(true);
    setScrubMs(getMsFromClientX(event.clientX));
  };

  const handleScrubMove = (event) => {
    if (!isScrubbing) return;
    if (activePointerIdRef.current !== event.pointerId) return;
    event.preventDefault();
    setScrubMs(getMsFromClientX(event.clientX));
  };

  const handleScrubEnd = async (event) => {
    if (!isScrubbing) return;
    if (activePointerIdRef.current !== event.pointerId) return;

    event.preventDefault();
    const finalMs = getMsFromClientX(event.clientX);
    setScrubMs(finalMs);
    setIsScrubbing(false);
    activePointerIdRef.current = null;

    try {
      await seekToMs(finalMs, { resume: true });
    } catch (error) {
      console.error('Seek error:', error);
    }
  };

  useEffect(() => {
    if (!isScrubbing) return;
    if (!durationMs) {
      setIsScrubbing(false);
    }
  }, [durationMs, isScrubbing]);

  const handleKeyDown = async (event) => {
    if (!durationMs && (event.key === 'ArrowLeft' || event.key === 'ArrowRight')) return;

    if (event.key === ' ' || event.code === 'Space') {
      event.preventDefault();
      try {
        await togglePlayPause();
      } catch (error) {
        console.error('Play/pause error:', error);
      }
      return;
    }

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      try {
        await seekToMs((progressMs || 0) - 5000, { resume: true });
      } catch (error) {
        console.error('Seek error:', error);
      }
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      try {
        await seekToMs((progressMs || 0) + 5000, { resume: true });
      } catch (error) {
        console.error('Seek error:', error);
      }
    }
  };

  return (
    <div
      className="surface-panel h-full rounded-2xl border border-fuchsia-700/30 p-3 sm:p-4 lg:p-5"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-lg sm:text-xl font-bold text-white">Playing Now</h2>

        {!isPlaybackLoading && item && (
          <span
            className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs sm:text-sm ${
              isPlaying ? 'bg-green-500/20 text-green-300' : 'bg-white/10 text-gray-300'
            }`}
          >
            <span className={`h-2 w-2 rounded-full ${isPlaying ? 'bg-green-300 animate-pulse' : 'bg-gray-300'}`} />
            {playbackStatus}
          </span>
        )}
      </div>

      {isPlaybackLoading && (
        <div className="flex items-center justify-center py-10">
          <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-fuchsia-400" />
        </div>
      )}

      {!isPlaybackLoading && !item && (
        <p className="py-10 text-center text-sm text-gray-300 sm:text-base">
          {isAuthed ? 'Click any song to start playing.' : 'Login to Spotify to start playing.'}
        </p>
      )}

      {!isPlaybackLoading && item && (
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-center">
            <img
              src={item.album.images[0]?.url}
              alt={item.album.name}
              className="mx-auto h-40 w-40 rounded-xl object-cover shadow-2xl sm:mx-0 sm:h-44 sm:w-44 lg:h-48 lg:w-48"
            />

            <div className="min-w-0 space-y-2 text-center sm:text-left">
              <h3 className="truncate text-lg font-bold text-white sm:text-xl">{item.name}</h3>
              <p className="truncate text-sm text-gray-300 sm:text-base">
                {item.artists.map((artist) => artist.name).join(', ')}
              </p>
              <p className="truncate text-xs text-gray-400 sm:text-sm">{item.album.name}</p>

              <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
                <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs text-gray-200">
                  Album: {item.album.name}
                </span>
                <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs text-gray-200">
                  Year: {releaseYear || 'N/A'}
                </span>
                <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs text-gray-200">
                  Genre: {genre || 'N/A'}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-center gap-3 sm:gap-4">
              <button
                type="button"
                onClick={previous}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-fuchsia-800/30 text-white transition-colors hover:bg-fuchsia-700/50"
                aria-label="Previous track"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z" />
                </svg>
              </button>

              <button
                type="button"
                onClick={togglePlayPause}
                className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-fuchsia-600 text-white shadow-lg transition-colors hover:bg-fuchsia-500"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <svg className="h-7 w-7" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="h-7 w-7" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                )}
              </button>

              <button
                type="button"
                onClick={next}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-fuchsia-800/30 text-white transition-colors hover:bg-fuchsia-700/50"
                aria-label="Next track"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0010 6v2.798l-5.445-3.63z" />
                </svg>
              </button>
            </div>

            <div className="space-y-1.5">
              <div
                ref={progressBarRef}
                role="slider"
                aria-label="Seek"
                aria-valuemin={0}
                aria-valuemax={durationMs || 0}
                aria-valuenow={Math.floor(displayProgressMs)}
                className="h-3.5 w-full cursor-pointer touch-none select-none overflow-hidden rounded-full bg-white/20"
                onPointerDown={handleScrubStart}
                onPointerMove={handleScrubMove}
                onPointerUp={handleScrubEnd}
                onPointerCancel={handleScrubEnd}
              >
                <div
                  className="h-full bg-gradient-to-r from-fuchsia-600 via-purple-500 to-fuchsia-600"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-300 sm:text-sm">
                <span>{formatTime(displayProgressMs || 0)}</span>
                <span>{formatTime(item.duration_ms)}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs text-gray-200 sm:grid-cols-3">
            <div className="rounded-lg bg-white/10 px-2.5 py-2">
              <p className="text-[11px] uppercase tracking-wide text-gray-300">Session Tracks</p>
              <p className="mt-0.5 text-sm font-semibold text-white">{recentlyPlayed.length}</p>
            </div>
            <div className="rounded-lg bg-white/10 px-2.5 py-2">
              <p className="text-[11px] uppercase tracking-wide text-gray-300">Recent Searches</p>
              <p className="mt-0.5 text-sm font-semibold text-white">{searchHistory.length}</p>
            </div>
            <div className="col-span-2 rounded-lg bg-white/10 px-2.5 py-2 sm:col-span-1">
              <p className="text-[11px] uppercase tracking-wide text-gray-300">Playback State</p>
              <p className="mt-0.5 truncate text-sm font-semibold text-white">{playbackStatus}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PlayingNow;
