import { useEffect, useMemo, useRef, useState } from 'react';
import { usePlayer } from '../hooks/usePlayer';

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
    recentlyPlayed
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

  const loading = isPlaybackLoading;

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

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

  // Calculate session stats
  const sessionTracksCount = recentlyPlayed.length;

  return (
    <div
      className="w-full theme-card rounded-xl shadow-2xl p-4 sm:p-5 border flex flex-col"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
          <svg className="w-6 h-6 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
          </svg>
          Playing Now
        </h2>
        {!loading && playbackState?.item && (
          <div>
            {isPlaying ? (
              <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 bg-green-500/20 text-green-400 rounded-full">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                Playing
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 bg-gray-500/20 text-gray-400 rounded-full">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                Paused
              </span>
            )}
          </div>
        )}
      </div>
      
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-fuchsia-400"></div>
        </div>
      )}

      {!loading && !playbackState?.item && (
        <div className="text-center py-8">
          <svg className="w-16 h-16 mx-auto text-purple-400/50 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
          </svg>
          <p className="text-gray-400">
            {isAuthed ? 'Click any song to start playing!' : 'Login to Spotify to start playing.'}
          </p>
        </div>
      )}

      {!loading && playbackState?.item && (
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Album Art - Compact */}
          <div className="flex-shrink-0 flex justify-center lg:justify-start">
            <img
              src={playbackState.item.album.images[0]?.url}
              alt={playbackState.item.album.name}
              className="w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64 rounded-lg shadow-xl object-cover"
            />
          </div>

          {/* Track Info & Controls - Compact */}
          <div className="flex-1 flex flex-col justify-between min-w-0">
            {/* Track Details */}
            <div className="space-y-2">
              <h3 className="text-lg sm:text-xl font-bold text-white line-clamp-2">
                {playbackState.item.name}
              </h3>
              <p className="text-sm sm:text-base text-purple-300 line-clamp-1">
                {playbackState.item.artists.map(a => a.name).join(', ')}
              </p>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                  </svg>
                  {playbackState.item.album.name}
                </span>
                {playbackState.item.album.release_date && (
                  <span>• {new Date(playbackState.item.album.release_date).getFullYear()}</span>
                )}
                {sessionTracksCount > 0 && (
                  <span>• {sessionTracksCount} tracks this session</span>
                )}
              </div>
            </div>

            {/* Controls - Compact */}
            <div className="space-y-3 mt-4">
              <div className="flex items-center justify-center gap-3 sm:gap-4">
                <button
                  onClick={previous}
                  className="p-2.5 rounded-full bg-purple-800/30 hover:bg-purple-700/50 text-white transition-all hover:scale-110"
                  aria-label="Previous"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z" />
                  </svg>
                </button>
                
                <button
                  onClick={togglePlayPause}
                  className="p-3 rounded-full bg-fuchsia-600 hover:bg-fuchsia-500 text-white transition-all hover:scale-110 shadow-lg"
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
                
                <button
                  onClick={next}
                  className="p-2.5 rounded-full bg-purple-800/30 hover:bg-purple-700/50 text-white transition-all hover:scale-110"
                  aria-label="Next"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0010 6v2.798l-5.445-3.63z" />
                  </svg>
                </button>
              </div>

              {/* Progress Bar - Compact */}
              <div className="space-y-1.5">
                <div
                  ref={progressBarRef}
                  role="slider"
                  aria-label="Seek"
                  aria-valuemin={0}
                  aria-valuemax={durationMs || 0}
                  aria-valuenow={Math.floor(displayProgressMs)}
                  className="h-2.5 bg-gray-700/50 rounded-full overflow-hidden w-full touch-none select-none cursor-pointer"
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
                <div className="flex justify-between text-xs text-gray-400">
                  <span>{formatTime(displayProgressMs || 0)}</span>
                  <span>{formatTime(playbackState.item.duration_ms)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PlayingNow;